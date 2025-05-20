import { json } from "@remix-run/react";
import { useLoaderData, Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import Truncate from "../components/truncate.jsx";
import { DotFilledIcon, HeartIcon, Share1Icon } from "@radix-ui/react-icons";
import { getCountryFlag } from "../components/country-card";
import Pagination from "../components/pagination.jsx";
import RadioCard from "../components/radio-card.jsx";
import { description as generateDescription } from "../description.js";
import { RadioBrowserApi, StationSearchType } from 'radio-browser-api'
import { generateLocalizedRoute } from "../utils/generate-route.jsx";
import PlayButton from "../utils/play-button.jsx";
import Header from "../components/header.jsx";
import ShareMenu from "../components/pop-ups/share-menu.jsx";
import React from "react";

export const loader = async ({ params, request }) => {
  const { id: countryCode } = params;
  const url = new URL(request.url);
  const currentPage = parseInt(url.searchParams.get("p")) || 1;
  const api = new RadioBrowserApi(process.env.APP_TITLE);  
  const recordsPerPage = 12;
  const offset = (currentPage - 1) * recordsPerPage;

  try {
    const country = await api.getCountries(countryCode);
    const description = await generateDescription({
      input: country[0].name,
      type: "country",
    });
      
    const totalRecords = country[0]?.stationcount || 0;

    const stations = await api.getStationsBy(StationSearchType.byCountryCodeExact, countryCode, {
      hideBroken: true,
      order: "clickcount",
      reverse: true,
      offset,
      limit: recordsPerPage,
    });

    return json({
      countryCode,
      countryName: country[0].name,
      stations,
      totalRecords,
      currentPage,
      recordsPerPage,
      description,
      locale: params.lang,
    });
  } catch (error) {
    console.error("Error in country details loader:", error);
    return json({
      countryCode,
      countryName: "",
      stations: [],
      totalRecords: 0,
      currentPage: 1,
      recordsPerPage,
    });
  }
};

export default function CountryDetails() {
  const {
    countryCode,
    countryName,
    stations,
    totalRecords,
    currentPage,
    recordsPerPage,
    description,
    locale
  } = useLoaderData();
  const { t } = useTranslation();
  const [showShareMenu, setShowShareMenu] = React.useState(false);

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
      <div className="bg-gradient-to-t from-[#000000e1] to-[#167AFE] w-full h-[25rem] flex items-center justify-center">
          <div className="flex mt-[5.125rem] flex-row px-20 w-full py-[3.5rem] gap-20">
              
              <div className="flex w-[42.6875rem] flex-row">
                <div className="w-16 h-16 mr-4 rounded-full overflow-hidden border-white flex-shrink-0">
                  <img
                    src={getCountryFlag(countryCode)}
                    alt={`${countryCode} flag`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="font-jakarta text-[2.5rem]/[3.25rem] text-white font-semibold mb-2 line-clamp-1">
                    <Truncate>{countryName}</Truncate>
                  </span>
                  <div className="flex flex-col gap-8 items-start mt-1">

                    <div className="flex flex-row">
                      <div className="flex items-center font-jakarta font-normal text-base/[1.5rem] text-gray-300">
                        <span>{totalRecords}</span>
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
                  {description ||
                    t("countryDescription", { country: countryName })}
                </span>

                <div className="w-full h-8">
                  <div className="flex flex-wrap gap-2">
                    {stations && stations.length > 0 && 
                      stations
                        .flatMap(station => station.tags || [])
                        .slice(0, 6)
                        .map((tag, index) => (
                          <Link 
                            key={`country-tag-${index}`}
                            to={generateLocalizedRoute(locale, `/details/genre/${encodeURIComponent(tag)}`)}
                            className="h-[2rem] w-min-[2.75rem] py-2 px-2 bg-[#FFFFFF]/20 rounded-lg text-white text-sm/[1.375rem] font-semibold font-jakarta flex items-center justify-center hover:scale-105 transition-all capitalize"
                          >
                            {tag}
                          </Link>
                        ))
                    }
                  </div>
                </div>

              </div>
          </div>
      </div>

      <div className="bg-white w-full py-8 px-20">
        <div className="w-full gap-6">
          <h2 className="text-lg font-medium mb-6">{t("allStations")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              }, index) => {
                return (
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
                );
              },
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
