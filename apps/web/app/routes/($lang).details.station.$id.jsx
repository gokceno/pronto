import { json } from "@remix-run/react";
import { useLoaderData, Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import Pagination from "../components/pagination.jsx";
import { DotFilledIcon, HeartIcon, Share1Icon } from "@radix-ui/react-icons";
import RadioCard from "../components/radio-card.jsx";
import { RadioBrowserApi, StationSearchType } from 'radio-browser-api'
import { generateLocalizedRoute } from "../utils/generate-route.jsx";
import PlayButton from "../utils/play-button.jsx";
import Header from "../components/header.jsx";

export const loader = async ({ params, request }) => {
  const { id: stationName } = params;
  const url = new URL(request.url);
  const api = new RadioBrowserApi(process.env.APP_TITLE);

  const currentPage = parseInt(url.searchParams.get("p")) || 1;
  const recordsPerPage = 12;
  const offset = (currentPage - 1) * recordsPerPage;

  const currentStationArr = await api.searchStations({ name: stationName });
  const currentStation = currentStationArr[0];

  // Similar stations according to first 5 tags
  const currentTags = (currentStation?.tags || []).slice(0, 5);
  console.log(currentTags);

  const stationsByTagArrays = await Promise.all(
    currentTags.map(tag =>
      api.getStationsBy(StationSearchType.byTag, tag, {
        hideBroken: true,
        order: "clickcount",
        reverse: true,
        offset,
        limit: recordsPerPage,
      })
    )
  );

  // 4. Merge and deduplicate stations
  const allStations = stationsByTagArrays.flat();
  const uniqueStations = Array.from(
    new Map(allStations.map(station => [station.id, station])).values()
  );

  return json({
    stationName,
    currentTags,
    stations: uniqueStations,
    totalRecords: uniqueStations.length,
    currentPage,
    recordsPerPage,
    locale: params.lang,
  });
};

export default function StationDetails() {
  const {
    stationName,
    currentTags,
    stations,
    currentPage,
    totalRecords,
    recordsPerPage,
    locale
  } = useLoaderData();
  const { t } = useTranslation();

  const featuredStation = stations && stations.length > 0 ? stations[0] : null;
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
      <Header locale={locale} className="flex-shrink-0" />
      <div className="bg-gradient-to-t from-[#000000e1] to-[#167AFE] w-full h-[25rem] flex items-center">
        <div className="flex mt-[5.125rem] flex-row px-20 w-full py-[3.5rem] gap-20">
          <div className="flex w-[42.6875rem] flex-row">
            <div>
              <span className="font-jakarta text-[2.5rem]/[3.25rem] text-white font-semibold mb-2 line-clamp-1 capitalize">
                {stationName}
              </span>
              <div className="flex flex-col gap-8 items-start mt-1">
                <div className="flex flex-row">
                  <div className="flex items-center font-jakarta font-normal text-base/[1.5rem] text-gray-300">
                    <span>{totalRecords}</span>
                    <span className="ml-1">{t("genreStations")}</span>
                  </div>
                  <DotFilledIcon className="w-6 h-6 text-gray-300"/>
                  <div className="flex items-center font-jakarta font-normal text-base/[1.5rem] text-gray-300">
                    <span>{totalRecords}</span>
                    <span className="ml-1">{t("likes")}</span>
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
                    />
                  )}
                  <HeartIcon className="w-[2rem] h-[2rem] text-white"/>
                  <Share1Icon className="w-[2rem] h-[2rem] text-white"/>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-[30.4375rem] flex-col gap-4 sm:gap-6 lg:gap-8 lg:max-w-2xl">
            <div className="flex flex-col gap-2 w-full h-[4.125rem]">
              <span className="text-white font-jakarta text-lg/[1.625rem] font-semibold">{t("about")}</span>
              <span className="text-white/80 font-jakarta text-sm/[1.375rem] font-normal">{null}</span>
            </div>
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
          <div className="w-full justify-center grid grid-cols-4 gap-6">
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