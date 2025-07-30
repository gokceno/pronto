import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import Pagination from "../components/pagination.jsx";
import { Share1Icon } from "@radix-ui/react-icons";
import RadioCard from "../components/radio-card.jsx";
import { generateLocalizedRoute } from "../utils/generate-route.jsx";
import PlayButton from "../utils/play-button.jsx";
import Header from "../components/header.jsx";
import ShareMenu from "../components/pop-ups/share-menu.jsx";
import React from "react";
import { formatNumber } from "../utils/format-number.js";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { and, eq, or, like, sql } from "drizzle-orm";
import { authenticator } from "@pronto/auth/auth.server.js";
import FavButton from "../utils/fav-button.jsx";

export const loader = async ({ params, request }) => {
  const user = await authenticator.isAuthenticated(request);

  const { id: listId } = params;
  const url = new URL(request.url);

  const currentPage = parseInt(url.searchParams.get("p")) || 1;
  const recordsPerPage = 12;
  const offset = (currentPage - 1) * recordsPerPage;

  // Get current list information
  const currentListArr = await dbServer
    .select({
      id: dbSchema.usersLists.id,
      name: dbSchema.usersLists.userListName,
      userId: dbSchema.usersLists.userId,
    })
    .from(dbSchema.usersLists)
    .where(
      and(
        eq(dbSchema.usersLists.id, listId),
        eq(dbSchema.usersLists.isDeleted, 0),
      ),
    );

  const currentList = currentListArr[0];
  if (!currentList) {
    return json({ error: "List not found" }, { status: 404 });
  }

  // Get all radios in the list
  const listRadios = await dbServer
    .select({
      radioId: dbSchema.usersListsRadios.radioId,
    })
    .from(dbSchema.usersListsRadios)
    .where(eq(dbSchema.usersListsRadios.usersListId, listId));

  const radioIds = listRadios.map((radio) => radio.radioId);

  if (radioIds.length === 0) {
    return json({
      name: currentList.name,
      listId,
      stations: [],
      currentPage,
      user,
      recordsPerPage,
      totalRecords: 0,
      locale: params.lang,
      similarStations: [],
    });
  }

  // Get detailed radio information for all radios in the list
  const listStationsDetails = await dbServer
    .select({
      id: dbSchema.radios.id,
      name: dbSchema.radios.radioName,
      url: dbSchema.radios.url,
      country: dbSchema.radios.countryId,
      radioTags: dbSchema.radios.radioTags,
      radioLanguage: dbSchema.radios.radioLanguage,
      favicon: dbSchema.radios.favicon,
    })
    .from(dbSchema.radios)
    .where(
      and(
        eq(dbSchema.radios.isDeleted, 0),
        sql`${dbSchema.radios.id} IN (${radioIds.join(",")})`,
      ),
    );

  // Extract all tags and languages from list stations for finding similar stations
  let allTags = [];
  let allLanguages = [];

  // Parse tags and languages from all stations in the list
  listStationsDetails.forEach((station) => {
    try {
      const stationTags = JSON.parse(station.radioTags || "[]");
      if (Array.isArray(stationTags)) {
        allTags = [...allTags, ...stationTags];
      }
    } catch (error) {
      console.warn(
        `Failed to parse radioTags for station ${station.id}:`,
        error,
      );
    }

    try {
      const stationLanguages = JSON.parse(station.radioLanguage || "[]");
      if (Array.isArray(stationLanguages)) {
        allLanguages = [...allLanguages, ...stationLanguages];
      }
    } catch (error) {
      console.warn(
        `Failed to parse radioLanguage for station ${station.id}:`,
        error,
      );
    }
  });

  // Get unique tags and languages
  const uniqueTags = [...new Set(allTags)].slice(0, 10);
  const uniqueLanguages = [...new Set(allLanguages)];

  // Process list stations with tags and languages
  const listStationsWithDetails = listStationsDetails.map((station) => {
    let tags = [];
    let language = [];

    try {
      tags = JSON.parse(station.radioTags || "[]");
      if (!Array.isArray(tags)) {
        tags = [];
      }
    } catch (error) {
      console.warn(
        `Failed to parse radioTags for station ${station.id}:`,
        error,
      );
    }

    try {
      language = JSON.parse(station.radioLanguage || "[]");
      if (!Array.isArray(language)) {
        language = [];
      }
    } catch (error) {
      console.warn(
        `Failed to parse radioLanguage for station ${station.id}:`,
        error,
      );
    }

    return {
      ...station,
      tags,
      language,
      clickCount: 0, // Default values since these aren't in the schema
      votes: 0,
    };
  });

  // Paginate the list stations
  const totalListStations = listStationsWithDetails.length;
  const paginatedListStations = listStationsWithDetails.slice(
    offset,
    offset + recordsPerPage,
  );

  // Build a query for similar stations (not in the list but with similar tags/languages)
  let whereClauses = [
    eq(dbSchema.radios.isDeleted, 0),
    sql`${dbSchema.radios.id} NOT IN (${radioIds.join(",")})`,
  ];

  // At least one tag matches (use LIKE for each tag)
  if (uniqueTags.length > 0) {
    whereClauses.push(
      or(
        ...uniqueTags.map((tag) => like(dbSchema.radios.radioTags, `%${tag}%`)),
      ),
    );
  }

  // At least one language matches (use LIKE for each language)
  if (uniqueLanguages.length > 0) {
    whereClauses.push(
      or(
        ...uniqueLanguages.map((lang) =>
          like(dbSchema.radios.radioLanguage, `%${lang}%`),
        ),
      ),
    );
  }

  // Get all similar stations
  const similarStations = await dbServer
    .select({
      id: dbSchema.radios.id,
      name: dbSchema.radios.radioName,
      url: dbSchema.radios.url,
      country: dbSchema.radios.countryId,
      radioTags: dbSchema.radios.radioTags,
      radioLanguage: dbSchema.radios.radioLanguage,
      favicon: dbSchema.radios.favicon,
    })
    .from(dbSchema.radios)
    .where(and(...whereClauses))
    .limit(6); // Limit to 6 similar stations

  // Process similar stations with tags and languages
  const similarStationsWithDetails = similarStations
    .map((station) => {
      let tags = [];
      let language = [];

      try {
        tags = JSON.parse(station.radioTags || "[]");
        if (!Array.isArray(tags)) {
          tags = [];
        }
      } catch (error) {
        console.warn(
          `Failed to parse radioTags for station ${station.id}:`,
          error,
        );
        tags = [];
      }

      try {
        language = JSON.parse(station.radioLanguage || "[]");
        if (!Array.isArray(language)) {
          language = [];
        }
      } catch (error) {
        console.warn(
          `Failed to parse radioLanguage for station ${station.id}:`,
          error,
        );
        language = [];
      }

      // Filter to only keep stations with at least 2 common tags
      const commonTags = tags.filter((tag) => uniqueTags.includes(tag));
      if (commonTags.length < 2 && uniqueTags.length > 0) {
        return null;
      }

      return {
        ...station,
        tags,
        language,
        clickCount: 0, // Default values since these aren't in the schema
        votes: 0,
      };
    })
    .filter(Boolean); // Remove null entries
  return json({
    name: currentList.name,
    listId,
    stations: paginatedListStations,
    currentPage,
    user,
    recordsPerPage,
    totalRecords: totalListStations,
    locale: params.lang,
    similarStations: similarStationsWithDetails,
    listTags: uniqueTags,
  });
};

export default function ListDetails() {
  const {
    name,
    listId,
    user,
    stations,
    similarStations,
    currentPage,
    totalRecords,
    recordsPerPage,
    locale,
    listTags,
  } = useLoaderData();
  const { t } = useTranslation();
  const [showShareMenu, setShowShareMenu] = React.useState(false);

  const stationList = stations.map(
    ({ id, name, url, country, clickCount, votes }) => ({
      id,
      name,
      url,
      country,
      clickCount,
      votes,
    }),
  );

  return (
    <div>
      <Header locale={locale} user={user} className="flex-shrink-0" />
      <div className="bg-gradient-to-t from-[#000000e1] to-[#167AFE] w-full h-[25rem] flex items-center">
        <div className="flex mt-[5.125rem] flex-row px-20 w-full py-[3.5rem] gap-20">
          <div className="flex w-[42.6875rem] flex-row">
            <div>
              <span className="font-jakarta text-[2.5rem]/[3.25rem] text-white font-semibold mb-2 line-clamp-1 capitalize">
                {name}
              </span>

              <div className="flex flex-col gap-8 items-start mt-1">
                <div className="flex flex-row">
                  <div className="flex items-center font-jakarta font-normal text-base/[1.5rem] text-gray-300">
                    <span>{formatNumber(locale, stations.length)}</span>
                    <span className="ml-1">{t("stations")}</span>
                  </div>
                </div>
                <div className="w-[16.25rem] h-[3rem] gap-4 flex flex-row items-center">
                  {stations.length > 0 && (
                    <PlayButton
                      stationId={stations[0].id}
                      name={stations[0].name}
                      url={stations[0].url}
                      country={stations[0].country}
                      clickcount={stations[0].clickCount}
                      votes={stations[0].votes}
                      type="banner"
                      className="text-white"
                      stationList={stationList}
                    />
                  )}
                  <div
                    className="hover:scale-110 flex items-center justify-center
                       rounded-full  transition-all cursor-pointer"
                  >
                    <FavButton
                      targetId={listId}
                      targetType={"list"}
                      user={user}
                      locale={locale}
                      type={"title"}
                    />
                  </div>
                  <button
                    className="flex items-center justify-center
                       rounded-full transition-all text-white cursor-pointer"
                    onClick={() => setShowShareMenu(true)}
                    aria-label={t("share")}
                  >
                    <Share1Icon className="w-[2rem] h-[2rem]" />
                  </button>
                </div>
                {showShareMenu && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <ShareMenu
                      locale={locale}
                      name={name}
                      onClose={() => setShowShareMenu(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex w-[30.4375rem] flex-col gap-4 sm:gap-6 lg:gap-8 lg:max-w-2xl">
            <div className="w-full h-8">
              <div className="flex flex-wrap gap-2">
                {listTags.map((tag, index) => (
                  <Link
                    key={`list-tag-${index}`}
                    to={generateLocalizedRoute(
                      locale,
                      `/details/genre/${encodeURIComponent(tag)}`,
                    )}
                    className="h-[2rem] w-min-[2.75rem] py-2 px-2 bg-[#FFFFFF]/20 rounded-lg text-white text-sm/[1.375rem] font-semibold font-jakarta flex items-center justify-center hover:scale-105 transition-all capitalize"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white w-full py-8 px-20">
        <div className="w-full gap-6">
          <h2 className="text-lg font-medium mb-6">{t("listStations")}</h2>
          <div className="w-full justify-center grid grid-cols-3 gap-6">
            {stations.map(
              (
                {
                  id,
                  name,
                  tags,
                  clickCount,
                  votes,
                  language,
                  url,
                  country,
                  favicon,
                },
                index,
              ) => (
                <RadioCard
                  key={id ? `station-${id}` : `station-index-${index}`}
                  stationuuid={id}
                  name={name}
                  tags={tags || []}
                  clickcount={clickCount}
                  votes={votes}
                  language={language}
                  url={url}
                  country={country}
                  locale={locale}
                  stationList={stationList}
                  favicon={favicon}
                />
              ),
            )}
          </div>

          {similarStations.length > 0 && (
            <>
              <h2 className="text-lg font-medium mb-6 mt-12">
                {t("similarStations")}
              </h2>
              <div className="w-full justify-center grid grid-cols-3 gap-6">
                {similarStations.map(
                  (
                    {
                      id,
                      name,
                      tags,
                      clickCount,
                      votes,
                      language,
                      url,
                      country,
                      favicon,
                    },
                    index,
                  ) => (
                    <RadioCard
                      key={
                        id
                          ? `similar-station-${id}`
                          : `similar-station-index-${index}`
                      }
                      stationuuid={id}
                      name={name}
                      tags={tags || []}
                      clickcount={clickCount}
                      votes={votes}
                      language={language}
                      url={url}
                      country={country}
                      locale={locale}
                      stationList={stationList}
                      favicon={favicon}
                    />
                  ),
                )}
              </div>
            </>
          )}
          <div className="mt-12 flex justify-center">
            <Pagination
              totalRecords={totalRecords}
              recordsPerPage={recordsPerPage}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
