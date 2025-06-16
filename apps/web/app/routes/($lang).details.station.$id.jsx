import { json } from "@remix-run/react";
import { useLoaderData, Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import Pagination from "../components/pagination.jsx";
import { DotFilledIcon, HeartIcon, Share1Icon } from "@radix-ui/react-icons";
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
      })
      .from(dbSchema.radios)
      .where(and(eq(dbSchema.radios.id, stationId), eq(dbSchema.radios.isDeleted, 0)));

    const currentStation = currentStationArr[0];
    if (!currentStation) {
      return json({ error: "Station not found" }, { status: 404 });
    }

    // Parse tags and language
    const currentTags = (() => { try { return JSON.parse(currentStation.radioTags); } catch { return []; } })().slice(0, 5);
    const currentLanguages = (() => { try { return JSON.parse(currentStation.radioLanguage); } catch { return []; } })();

    // Build a query for similar stations
    let whereClauses = [
      eq(dbSchema.radios.isDeleted, 0),
      sql`${dbSchema.radios.id} != ${stationId}`
    ];

    // At least one tag matches (use LIKE for each tag)
    if (currentTags.length > 0) {
      whereClauses.push(
        or(...currentTags.map(tag => like(dbSchema.radios.radioTags, `%${tag}%`)))
      );
    }

    // At least one language matches (use LIKE for each language)
    if (currentLanguages.length > 0) {
      whereClauses.push(eq(dbSchema.radios.radioLanguage, JSON.stringify(currentLanguages)));
    }

    // Get all similar stations
    const allStations = await dbServer
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
      .where(and(...whereClauses));

    // Remove duplicates and paginate
    const uniqueStations = Array.from(
      new Map(allStations.map(station => [station.id, station])).values()
    ).filter(station => {
      const stationTags = (() => { try { return JSON.parse(station.radioTags); } catch { return []; } })();
      // Count common tags
      const commonTags = stationTags.filter(tag => currentTags.includes(tag));
      return commonTags.length >= 2;
    });

    const totalRecords = uniqueStations.length;
    const paginatedStations = uniqueStations.slice(offset, offset + recordsPerPage);

    // Parse tags/language for each station
    const stationsWithTags = paginatedStations.map(station => ({
      ...station,
      tags: (() => { try { return JSON.parse(station.radioTags); } catch { return []; } })(),
      language: (() => { try { return JSON.parse(station.radioLanguage); } catch { return []; } })(),
      clickCount: station.clickCount || 0,
      votes: station.votes || 0,
    }));
  
    return json({
      name: currentStation.name,
      stationId,
      votes: currentStation.votes || 0,
      currentStation: {
        ...currentStation,
        tags: currentTags,
        language: currentLanguages,
        clickCount: currentStation.clickCount || 0,
        votes: currentStation.votes || 0,
      },
      currentTags,
      stations: stationsWithTags,
      clickCount: currentStation.clickCount || 0,
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
    clickCount
  } = useLoaderData();
  const { t } = useTranslation();
  const [showShareMenu, setShowShareMenu] = React.useState(false);

  const stationList = stations.map(({ id, name, url, country, clickCount, votes }) => ({
    id,
    name,
    url,
    country,
    clickCount,
    votes
  }));

  return (
    <div>
      <Header locale={locale} userIconURL={user.avatar} className="flex-shrink-0" />
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
                  <DotFilledIcon className="w-6 h-6 text-gray-300"/>
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
                    />
                    )}
                    <div
                      className="hover:scale-110 flex items-center justify-center
                       rounded-full  transition-all text-white cursor-pointer"
                    >
                      <HeartIcon className="w-[2rem] h-[2rem] text-white"/>
                    </div>
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
                {currentTags.map((tag, index) => (
                  <Link 
                    key={`station-tag-${index}`}
                    to={generateLocalizedRoute(locale, `/details/genre/${encodeURIComponent(tag)}`)}
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
              ({
                id,
                name,
                tags,
                clickCount,
                votes,
                language,
                url,
                country,
                favicon
              }, index) => (
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