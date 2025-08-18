import { json } from "@remix-run/node";
import { useLoaderData, Link, useFetcher } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import Pagination from "../components/pagination.jsx";
import { DotsVerticalIcon, DotFilledIcon } from "@radix-ui/react-icons";
import RadioCard from "../components/radio-card.jsx";
import { generateLocalizedRoute } from "../utils/generate-route.jsx";
import PlayButton from "../utils/play-button.jsx";
import Header from "../components/header.jsx";
import { formatNumber } from "../utils/format-number.js";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { and, eq, sql, count } from "drizzle-orm";
import { authenticator } from "@pronto/auth/auth.server.js";
import FavButton from "../utils/fav-button.jsx";
import ListContextMenu from "../components/pop-ups/list-context-menu.jsx";
import ShareMenu from "../components/pop-ups/share-menu.jsx";

// Helper functions for loader
const safeParseJSON = (jsonStr, fallback = []) => {
  try {
    const parsed = JSON.parse(jsonStr || "[]");
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    return fallback;
  }
};

export const loader = async ({ params, request }) => {
  const user = await authenticator.isAuthenticated(request);
  const { id: listId } = params;
  const url = new URL(request.url);
  const currentPage = parseInt(url.searchParams.get("p")) || 1;
  const recordsPerPage = 12;
  const offset = (currentPage - 1) * recordsPerPage;

  // Get current list information
  const [currentList] = await dbServer
    .select({
      id: dbSchema.usersLists.id,
      name: dbSchema.usersLists.userListName,
      userId: dbSchema.usersLists.userId,
      createdAt: dbSchema.usersLists.createdAt,
    })
    .from(dbSchema.usersLists)
    .where(
      and(
        eq(dbSchema.usersLists.id, listId),
        eq(dbSchema.usersLists.isDeleted, 0),
      ),
    );

  if (!currentList) {
    return json({ error: "List not found" }, { status: 404 });
  }

  // Get all radios in the list with their details in a single join query
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
    .from(dbSchema.usersListsRadios)
    .innerJoin(
      dbSchema.radios,
      eq(dbSchema.usersListsRadios.radioId, dbSchema.radios.id),
    )
    .where(
      and(
        eq(dbSchema.usersListsRadios.usersListId, listId),
        eq(dbSchema.radios.isDeleted, 0),
      ),
    );

  if (listStationsDetails.length === 0) {
    return json({
      name: currentList.name,
      createdAt: currentList.createdAt,
      listId,
      stations: [],
      currentPage,
      user,
      recordsPerPage,
      totalRecords: 0,
      locale: params.lang,
      listTags: [],
      similarStations: [],
    });
  }

  // Get favorite counts for all stations in the list
  const stationIds = listStationsDetails.map((station) => station.id);
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

  // Process stations and extract metadata
  const processedStations = listStationsDetails.map((station) => ({
    ...station,
    tags: safeParseJSON(station.radioTags),
    language: safeParseJSON(station.radioLanguage),
    clickCount: 0,
    votes: favCounts[station.id] || 0,
  }));

  // Extract and deduplicate tags
  const allTags = [];

  processedStations.forEach((station) => {
    allTags.push(...station.tags);
  });

  const uniqueTags = [...new Set(allTags)].slice(0, 10);

  // Paginate stations
  const totalListStations = processedStations.length;
  const paginatedListStations = processedStations.slice(
    offset,
    offset + recordsPerPage,
  );

  // Find similar stations that share at least 2 tags with any station in the list
  // Get IDs of stations already in the list to exclude them
  const listStationIds = processedStations.map((station) => station.id);

  // Flatten all tags from all stations in the list
  const allTagsForSimilarityCheck = processedStations.reduce((acc, station) => {
    return [...acc, ...station.tags];
  }, []);

  // Only proceed if we have tags to work with
  let similarStations = [];
  if (allTagsForSimilarityCheck.length > 0) {
    // Get stations that have at least one matching tag
    const potentialSimilarStations = await dbServer
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
      .where(and(eq(dbSchema.radios.isDeleted, 0)))
      .limit(100); // Limit the initial query to prevent excessive processing

    // Get favorite counts for potential similar stations
    const potentialStationIds = potentialSimilarStations.map(
      (station) => station.id,
    );
    const similarFavCounts = {};

    if (potentialStationIds.length > 0) {
      const similarFavoriteResults = await dbServer
        .select({
          targetId: dbSchema.favorites.targetId,
          count: count(dbSchema.favorites.id),
        })
        .from(dbSchema.favorites)
        .where(
          and(
            eq(dbSchema.favorites.targetType, "radio"),
            sql`${dbSchema.favorites.targetId} IN (${sql.join(
              potentialStationIds.map((id) => sql`${id}`),
              sql`, `,
            )})`,
          ),
        )
        .groupBy(dbSchema.favorites.targetId);

      similarFavoriteResults.forEach((result) => {
        similarFavCounts[result.targetId] = result.count;
      });
    }

    // Process each station to parse JSON fields
    const processedPotentialStations = potentialSimilarStations
      .map((station) => ({
        ...station,
        tags: safeParseJSON(station.radioTags),
        language: safeParseJSON(station.radioLanguage),
        clickCount: 0,
        votes: similarFavCounts[station.id] || 0,
      }))
      // Exclude stations already in the list
      .filter((station) => !listStationIds.includes(station.id));

    // Count matching tags for each station
    const stationsWithMatchingTagCount = processedPotentialStations.map(
      (station) => {
        const matchingTagCount = station.tags.filter((tag) =>
          allTagsForSimilarityCheck.includes(tag),
        ).length;

        return {
          ...station,
          matchingTagCount,
        };
      },
    );

    // Filter stations with at least 2 matching tags and sort by number of matching tags (descending)
    similarStations = stationsWithMatchingTagCount
      .filter((station) => station.matchingTagCount >= 2)
      .sort((a, b) => b.matchingTagCount - a.matchingTagCount)
      .slice(0, 6); // Limit to 6 similar stations
  }

  return {
    name: currentList.name,
    createdAt: currentList.createdAt,
    listId,
    stations: paginatedListStations,
    currentPage,
    user,
    recordsPerPage,
    totalRecords: totalListStations,
    locale: params.lang,
    listTags: uniqueTags,
    similarStations,
  };
};

export default function ListDetails() {
  const {
    name,
    listId,
    user,
    createdAt,
    stations,
    currentPage,
    totalRecords,
    recordsPerPage,
    locale,
    listTags,
    similarStations,
  } = useLoaderData();
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const menuRef = useRef();
  const shareMenuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      // Check if click is outside menu ref
      const isOutsideMenu =
        menuRef.current && !menuRef.current.contains(event.target);
      // Check if click is outside share menu ref
      const isOutsideShareMenu =
        shareMenuRef.current && !shareMenuRef.current.contains(event.target);

      if (isOutsideMenu) {
        setMenuOpen(false);
        // Only close share menu if the click is also outside the share menu
        if (shareMenuOpen && isOutsideShareMenu) {
          setShareMenuOpen(false);
        }
      }
    }
    if (menuOpen || shareMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, shareMenuOpen]);

  useEffect(() => {
    if (shareMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [shareMenuOpen]);

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

  // Create a list for similar stations as well
  const similarStationList =
    similarStations?.map(({ id, name, url, country, clickCount, votes }) => ({
      id,
      name,
      url,
      country,
      clickCount,
      votes,
    })) || [];

  function formatCreatedAt(dateString) {
    if (!dateString || typeof dateString !== "string") return "";
    const [datePart] = dateString.split(" ");
    if (!datePart) return "";
    const [year, month, day] = datePart.split("-");
    if (!year || !month || !day) return "";
    return `${day}.${month}.${year}`;
  }

  return (
    <div>
      <Header locale={locale} user={user} className="flex-shrink-0" />
      <div className="bg-gradient-to-t from-[#000000e1] to-[#167AFE] w-full h-[25rem] flex items-center">
        <div className="flex mt-[5.125rem] flex-row px-20 w-full py-[3.5rem] gap-20">
          <div className="flex w-[42.6875rem] flex-row">
            <div>
              <span className="font-jakarta text-[2.5rem]/[3.25rem] text-white font-semibold mb-2 line-clamp-1">
                {name}
              </span>

              <div className="flex flex-col gap-8 items-start mt-1">
                <div className="flex flex-row items-center">
                  <span className=" font-jakarta font-normal text-base/[1.5rem] text-gray-300">
                    {t("createdAt", { date: formatCreatedAt(createdAt) })}
                  </span>
                  <DotFilledIcon className="w-6 h-6 text-gray-300" />
                  <div className="flex items-center font-jakarta font-normal text-base/[1.5rem] text-gray-300">
                    <span>{formatNumber(locale, stations.length)}</span>
                    <span className="ml-1">{t("radioStations")}</span>
                  </div>
                </div>
                <div className="w-[16.25rem] h-[3rem] gap-4 flex flex-row items-center">
                  {stations.length > 0 && (
                    <PlayButton
                      stationId={stations[0]?.id}
                      name={stations[0]?.name}
                      url={stations[0]?.url}
                      country={stations[0]?.country}
                      clickcount={stations[0]?.clickCount}
                      votes={stations[0]?.votes}
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
                  <div className="relative" ref={menuRef}>
                    <button
                      className="flex items-center justify-center p-1 -ml-1
                         rounded-full transition-all text-white cursor-pointer hover:bg-[#E8F2FF] focus:bg-[#E8F2FF] group/button"
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        setMenuOpen((prev) => !prev);
                      }}
                    >
                      <DotsVerticalIcon className="w-[1.8rem] h-[1.8rem] group-hover/button:text-[#167AFE] group-focus/button:text-[#167AFE]" />
                    </button>
                    {menuOpen && (
                      <div className="absolute left-0 -mr-24 z-20 mt-6 shadow-2xl drop-shadow-lg rounded-xl">
                        <ListContextMenu
                          locale={locale}
                          listId={listId}
                          onDelete={() => {
                            fetcher.submit(
                              { userListId: listId },
                              {
                                method: "delete",
                                action:
                                  "/api/radio-lists?operation=delete-list",
                                encType: "application/json",
                              },
                            );
                            setMenuOpen(false);
                          }}
                          onShare={() => {
                            setMenuOpen(false);
                            setShareMenuOpen(true);
                          }}
                        />
                      </div>
                    )}
                    {shareMenuOpen && (
                      <ShareMenu
                        open={true}
                        locale={locale}
                        onClose={() => setShareMenuOpen(false)}
                        name={name}
                        type={"list"}
                        parentRef={shareMenuRef}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-[30.4375rem] flex-col gap-4 sm:gap-6 lg:gap-8 lg:max-w-2xl">
            <div className="w-full h-8">
              <div className="flex flex-wrap gap-2">
                {listTags?.map((tag, index) => (
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
      <div className="flex bg-white h-[17rem] w-full py-8 px-20">
        <div className="w-full gap-6">
          <h2 className="text-lg font-medium mb-6">{t("listStations")}</h2>
          <div className="w-full justify-center grid grid-cols-3 gap-6">
            {stations && stations.length > 0 ? (
              stations.map(
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
              )
            ) : (
              <div className="col-span-3 font-jakarta text-center text-gray-400 py-12 text-lg font-medium">
                {t("noListItems")}
              </div>
            )}
          </div>

          {stations && stations.length > 6 && (
            <div className="mt-12 flex justify-center">
              <Pagination
                totalRecords={totalRecords}
                recordsPerPage={recordsPerPage}
                currentPage={currentPage}
              />
            </div>
          )}

          {similarStations && similarStations.length > 0 && (
            <div className="mt-16">
              <h2 className="text-lg font-medium mb-6">
                {t("similarStations")}
              </h2>
              <div className="w-full justify-center grid grid-cols-3 gap-6">
                {similarStations?.map(
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
                      stationList={similarStationList}
                      favicon={favicon}
                    />
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
