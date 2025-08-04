import { json } from "@remix-run/react";
import { useLoaderData, Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import Pagination from "../components/pagination.jsx";
import { Share1Icon } from "@radix-ui/react-icons";
import { description as generateDescription } from "../description.js";
import { generateLocalizedRoute } from "../utils/generate-route.jsx";
import PlayButton from "../utils/play-button.jsx";
import Header from "../components/header.jsx";
import ShareMenu from "../components/pop-ups/share-menu.jsx";
import React from "react";
import StationCard from "../components/station-card.jsx";
import { formatNumber } from "../utils/format-number.js";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { eq, and, like, count } from "drizzle-orm";
import { authenticator } from "@pronto/auth/auth.server.js";

export const loader = async ({ params, request }) => {
  const user = await authenticator.isAuthenticated(request);

  const { id: genre } = params;
  const url = new URL(request.url);
  const currentPage = parseInt(url.searchParams.get("p")) || 1;
  const description = await generateDescription({
    input: genre,
    type: "genre",
  });
  const recordsPerPage = 12;
  const offset = (currentPage - 1) * recordsPerPage;

  const genreLike = `%${genre}%`;
  const totalRecordsResult = await dbServer
    .select({ count: count(dbSchema.radios.id) })
    .from(dbSchema.radios)
    .where(
      and(
        like(dbSchema.radios.radioTags, genreLike),
        eq(dbSchema.radios.isDeleted, 0),
      ),
    );
  const totalRecords = totalRecordsResult[0]?.count || 0;
  const stations = await dbServer
    .select({
      id: dbSchema.radios.id,
      name: dbSchema.radios.radioName,
      url: dbSchema.radios.url,
      country: dbSchema.radios.countryId,
      radioTags: dbSchema.radios.radioTags,
      favicon: dbSchema.radios.favicon,
    })
    .from(dbSchema.radios)
    .where(
      and(
        like(dbSchema.radios.radioTags, genreLike),
        eq(dbSchema.radios.isDeleted, 0),
      ),
    )
    .offset(offset)
    .limit(recordsPerPage);

  const stationsWithTags = stations.map((station) => ({
    ...station,
    tags: (() => {
      try {
        return JSON.parse(station.radioTags);
      } catch {
        return [];
      }
    })(),
    clickCount: station.clickCount || 0,
    votes: station.votes || 0,
  }));

  return json({
    genre,
    description,
    stations: stationsWithTags,
    totalRecords,
    user,
    currentPage,
    recordsPerPage,
    locale: params.lang,
  });
};

export default function GenreDetails() {
  const {
    genre,
    user,
    stations,
    description,
    currentPage,
    totalRecords,
    recordsPerPage,
    locale,
  } = useLoaderData();
  const { t } = useTranslation();
  const [showShareMenu, setShowShareMenu] = React.useState(false);

  const featuredStation = stations && stations.length > 0 ? stations[0] : null;
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
                {genre}
              </span>
              <div className="flex flex-col gap-8 items-start mt-1">
                <div className="flex flex-row">
                  <div className="flex items-center font-jakarta font-normal text-base/[1.5rem] text-gray-300">
                    <span>{formatNumber(locale, totalRecords)}</span>
                    <span className="ml-1">{t("genreStations")}</span>
                  </div>
                </div>

                <div className="w-[16.25rem] h-[3rem] gap-4 flex flex-row items-center">
                  {featuredStation && (
                    <PlayButton
                      stationId={featuredStation.id}
                      name={featuredStation.name}
                      url={featuredStation.url}
                      country={featuredStation.country}
                      clickcount={featuredStation.clickCount}
                      votes={featuredStation.votes}
                      type="banner"
                      className="text-white"
                      stationList={stationList}
                    />
                  )}
                  <div
                    className="hover:scale-110 flex items-center justify-center
                        rounded-full transition-all text-white cursor-pointer"
                    onClick={() => setShowShareMenu(true)}
                  >
                    <Share1Icon className="w-[2rem] h-[2rem]" />
                  </div>
                </div>
                {showShareMenu && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <ShareMenu
                      locale={locale}
                      radioName={name}
                      onClose={() => setShowShareMenu(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex w-[30.4375rem] flex-col gap-4 sm:gap-6 lg:gap-8 lg:max-w-2xl">
            <span className="text-white/80 font-jakarta text-sm/[1.375rem] font-normal">
              {description}
            </span>

            <div className="w-full h-8">
              <div className="flex flex-wrap gap-2">
                {stations &&
                  stations.length > 0 &&
                  stations
                    .flatMap((station) => station.tags || [])
                    .slice(0, 6)
                    .map((tag, index) => (
                      <Link
                        key={`country-tag-${index}`}
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
                { id, name, clickCount, votes, url, country, favicon },
                index,
              ) => (
                <StationCard
                  key={id ? `station-${id}` : `station-index-${index}`}
                  stationuuid={id}
                  name={name}
                  clickCount={clickCount}
                  votes={votes}
                  url={url}
                  country={country}
                  locale={locale}
                  stationList={stationList}
                  favicon={favicon}
                  user={user}
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
