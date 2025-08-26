import { json } from "@remix-run/react";
import { useLoaderData, Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import Pagination from "../components/pagination.jsx";
import { DotFilledIcon, Share1Icon } from "@radix-ui/react-icons";
import RadioCard from "../components/radio-card.jsx";
import { generateLocalizedRoute } from "../utils/generate-route.jsx";
import PlayButton from "../utils/play-button.jsx";
import Header from "../components/header.jsx";
import ShareMenu from "../components/pop-ups/share-menu.jsx";
import React from "react";
import { formatNumber } from "../utils/format-number.js";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { and, eq, or, like, sql, count } from "drizzle-orm";
import { authenticator } from "@pronto/auth/auth.server.js";
import { updateListeningCounts } from "../services/listening-count.server.js";
import FavButton from "../utils/fav-button.jsx";

export const loader = async ({ params, request }) => {
  const user = await authenticator.isAuthenticated(request);

  const { id: stationId } = params;
  const url = new URL(request.url);

  const currentPage = parseInt(url.searchParams.get("p")) || 1;
  const recordsPerPage = 12;
  const offset = (currentPage - 1) * recordsPerPage;

  const currentStationArr = await dbServer
    .select({
      id: dbSchema.radios.id,
      name: dbSchema.radios.radioName,
      url: dbSchema.radios.url,
      country: dbSchema.radios.countryId,
      radioTags: dbSchema.radios.radioTags,
      radioLanguage: dbSchema.radios.radioLanguage,
      favicon: dbSchema.radios.favicon,
      userScore: dbSchema.radios.userScore,
    })
    .from(dbSchema.radios)
    .where(
      and(eq(dbSchema.radios.id, stationId), eq(dbSchema.radios.isDeleted, 0)),
    );

  const currentStation = currentStationArr[0];
  if (!currentStation) {
    return json({ error: "Station not found" }, { status: 404 });
  }

  // Get favorite count for current station
  const currentStationFavCount = await dbServer
    .select({
      count: count(dbSchema.favorites.id),
    })
    .from(dbSchema.favorites)
    .where(
      and(
        eq(dbSchema.favorites.targetType, "radio"),
        eq(dbSchema.favorites.targetId, stationId),
      ),
    );

  const currentStationFaves = currentStationFavCount[0]?.count || 0;

  // Parse tags and language with better error handling
  let currentTags = [];
  let currentLanguages = [];

  try {
    currentTags = JSON.parse(currentStation.radioTags || "[]");
    if (!Array.isArray(currentTags)) {
      currentTags = [];
    }
    currentTags = currentTags.slice(0, 5);
  } catch (error) {
    console.warn(
      `Failed to parse radioTags for current station ${stationId}:`,
      error,
    );
    currentTags = [];
  }

  try {
    currentLanguages = JSON.parse(currentStation.radioLanguage || "[]");
    if (!Array.isArray(currentLanguages)) {
      currentLanguages = [];
    }
  } catch (error) {
    console.warn(
      `Failed to parse radioLanguage for current station ${stationId}:`,
      error,
    );
    currentLanguages = [];
  }

  // Helper function to check if station has same language as current station
  const hasSameLanguage = (station) => {
    if (currentLanguages.length === 0) return false;

    let stationLanguages = [];
    try {
      stationLanguages = JSON.parse(station.radioLanguage || "[]");
      if (!Array.isArray(stationLanguages)) {
        stationLanguages = [];
      }
    } catch (error) {
      console.warn(
        `Failed to parse radioLanguage for station ${station.id}:`,
        error,
      );
      stationLanguages = [];
    }

    return stationLanguages.some((lang) => currentLanguages.includes(lang));
  };

  // Helper function to get common tags count
  const getCommonTagsCount = (station) => {
    if (currentTags.length === 0) return 0;

    let stationTags = [];
    try {
      stationTags = JSON.parse(station.radioTags || "[]");
      if (!Array.isArray(stationTags)) {
        stationTags = [];
      }
    } catch (error) {
      console.warn(
        `Failed to parse radioTags for station ${station.id}:`,
        error,
      );
      stationTags = [];
    }

    return stationTags.filter((tag) => currentTags.includes(tag)).length;
  };

  // Build base query for all potential similar stations
  let baseWhereClauses = [
    eq(dbSchema.radios.isDeleted, 0),
    sql`${dbSchema.radios.id} != ${stationId}`,
  ];

  // First, try to find stations with same language AND common tags
  let primaryWhereClauses = [...baseWhereClauses];

  // Add language condition
  if (currentLanguages.length > 0) {
    primaryWhereClauses.push(
      or(
        ...currentLanguages.map((lang) =>
          like(dbSchema.radios.radioLanguage, `%${lang}%`),
        ),
      ),
    );
  }

  // Add tag condition
  if (currentTags.length > 0) {
    primaryWhereClauses.push(
      or(
        ...currentTags.map((tag) =>
          like(dbSchema.radios.radioTags, `%${tag}%`),
        ),
      ),
    );
  }

  // Get stations with same language and common tags
  const primaryStations = await dbServer
    .select({
      id: dbSchema.radios.id,
      name: dbSchema.radios.radioName,
      url: dbSchema.radios.url,
      country: dbSchema.radios.countryId,
      radioTags: dbSchema.radios.radioTags,
      radioLanguage: dbSchema.radios.radioLanguage,
      favicon: dbSchema.radios.favicon,
      userScore: dbSchema.radios.userScore,
    })
    .from(dbSchema.radios)
    .where(and(...primaryWhereClauses))
    .orderBy(sql`${dbSchema.radios.userScore} DESC`);

  // Filter for stations with same language AND at least one common tag
  const primaryFiltered = Array.from(
    new Map(primaryStations.map((station) => [station.id, station])).values(),
  ).filter((station) => {
    const commonTagsCount = getCommonTagsCount(station);
    const sameLanguage = hasSameLanguage(station);

    // Must have same language AND at least one common tag
    return sameLanguage && commonTagsCount >= 1;
  });

  let uniqueStations = primaryFiltered;

  // If we have fewer than 3 stations, fallback to just common tags (ignore language)
  if (uniqueStations.length < 3 && currentTags.length > 0) {
    let fallbackWhereClauses = [...baseWhereClauses];

    // Add only tag condition for fallback
    fallbackWhereClauses.push(
      or(
        ...currentTags.map((tag) =>
          like(dbSchema.radios.radioTags, `%${tag}%`),
        ),
      ),
    );

    const fallbackStations = await dbServer
      .select({
        id: dbSchema.radios.id,
        name: dbSchema.radios.radioName,
        url: dbSchema.radios.url,
        country: dbSchema.radios.countryId,
        radioTags: dbSchema.radios.radioTags,
        radioLanguage: dbSchema.radios.radioLanguage,
        favicon: dbSchema.radios.favicon,
        userScore: dbSchema.radios.userScore,
      })
      .from(dbSchema.radios)
      .where(and(...fallbackWhereClauses))
      .orderBy(sql`${dbSchema.radios.userScore} DESC`);

    // Filter for stations with at least one common tag (regardless of language)
    const fallbackFiltered = Array.from(
      new Map(
        fallbackStations.map((station) => [station.id, station]),
      ).values(),
    ).filter((station) => {
      const commonTagsCount = getCommonTagsCount(station);
      return commonTagsCount >= 1;
    });

    // Merge primary and fallback results, removing duplicates
    const combinedStations = [...primaryFiltered];
    fallbackFiltered.forEach((station) => {
      if (!combinedStations.find((existing) => existing.id === station.id)) {
        combinedStations.push(station);
      }
    });

    uniqueStations = combinedStations;
  }

  // Final fallback: if still no stations and current station has no tags,
  // just show highest rated stations
  if (uniqueStations.length === 0) {
    const highestRatedStations = await dbServer
      .select({
        id: dbSchema.radios.id,
        name: dbSchema.radios.radioName,
        url: dbSchema.radios.url,
        country: dbSchema.radios.countryId,
        radioTags: dbSchema.radios.radioTags,
        radioLanguage: dbSchema.radios.radioLanguage,
        favicon: dbSchema.radios.favicon,
        userScore: dbSchema.radios.userScore,
      })
      .from(dbSchema.radios)
      .where(and(...baseWhereClauses))
      .orderBy(sql`${dbSchema.radios.userScore} DESC`)
      .limit(36); // Get enough for 3 pages

    uniqueStations = Array.from(
      new Map(
        highestRatedStations.map((station) => [station.id, station]),
      ).values(),
    );
  }

  const totalRecords = uniqueStations.length;
  const paginatedStations = uniqueStations.slice(
    offset,
    offset + recordsPerPage,
  );

  // Get favorite counts for all similar stations
  const stationIds = [
    stationId,
    ...paginatedStations.map((station) => station.id),
  ];
  const favCounts = {};

  if (stationIds.length > 0) {
    const favoriteResults = await dbServer
      .select({
        targetId: dbSchema.favorites.targetId,
        count: count(dbSchema.favorites.id),
      })
      .from(dbSchema.favorites)
      .where(
        and(
          eq(dbSchema.favorites.targetType, "radio"),
          sql`${dbSchema.favorites.targetId} IN (${sql.join(
            stationIds.map((id) => sql`${id}`),
            sql`, `,
          )})`,
        ),
      )
      .groupBy(dbSchema.favorites.targetId);

    favoriteResults.forEach((result) => {
      favCounts[result.targetId] = result.count;
    });
  }

  // Get listening counts for all stations (will update if needed)
  const listeningCounts = await updateListeningCounts(stationIds);

  // Parse tags/language for each station with better error handling
  const stationsWithTags = paginatedStations.map((station) => {
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

    return {
      ...station,
      tags,
      language,
      clickCount: listeningCounts[station.id] || 0,
      votes: favCounts[station.id] || 0,
    };
  });
  return json({
    name: currentStation.name,
    stationId,
    votes: currentStationFaves,
    currentStation: {
      ...currentStation,
      tags: currentTags,
      language: currentLanguages,
      clickCount: listeningCounts[currentStation.id] || 0,
      votes: currentStationFaves,
    },
    currentTags,
    stations: stationsWithTags,
    clickCount: listeningCounts[currentStation.id] || 0,
    currentPage,
    user,
    recordsPerPage,
    totalRecords,
    locale: params.lang,
  });
};

export default function StationDetails() {
  const {
    name,
    currentTags,
    currentStation,
    user,
    stations,
    stationId,
    currentPage,
    totalRecords,
    recordsPerPage,
    locale,
    votes,
    clickCount,
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
                    <span>{formatNumber(locale, clickCount)}</span>
                    <span className="ml-1">{t("listeningCount")}</span>
                  </div>
                  <DotFilledIcon className="w-6 h-6 text-gray-300" />
                  <div className="flex items-center font-jakarta font-normal text-base/[1.5rem] text-gray-300">
                    <span>{formatNumber(locale, votes)}</span>
                    <span className="ml-1">{t("likes")}</span>
                  </div>
                </div>
                <div className="w-[16.25rem] h-[3rem] gap-4 flex flex-row items-center">
                  {currentStation && (
                    <PlayButton
                      stationId={stationId}
                      name={currentStation.name}
                      url={currentStation.url}
                      country={currentStation.country}
                      clickcount={currentStation.clickCount}
                      votes={currentStation.votes}
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
                      targetId={stationId}
                      targetType={"radio"}
                      user={user}
                      locale={locale}
                      type={"title"}
                    />
                  </div>
                  <div
                    className="flex items-center justify-center
                       rounded-full transition-all text-white cursor-pointer"
                    onClick={() => setShowShareMenu(true)}
                  >
                    <Share1Icon className="w-[2rem] h-[2rem]" />
                  </div>
                </div>
                {showShareMenu && (
                  <ShareMenu
                    locale={locale}
                    name={name}
                    onClose={() => setShowShareMenu(false)}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex w-[30.4375rem] flex-col gap-4 sm:gap-6 lg:gap-8 lg:max-w-2xl">
            <div className="w-full h-8">
              <div className="flex flex-wrap gap-2">
                {currentTags.map((tag, index) => (
                  <Link
                    key={`station-tag-${index}`}
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
          <h2 className="text-lg font-medium mb-6">{t("allStations")}</h2>
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
