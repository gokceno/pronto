import { json } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { PlayerProvider } from "../contexts/player";
import Truncate from "../components/truncate.jsx";
import { getCountryFlag } from "../components/country-card";
import Pagination from "../components/pagination.jsx";
import RadioCard from "../components/radio-card.jsx";
import { description as generateDescription } from "../description.js";
import { RadioBrowserApi, StationSearchType } from 'radio-browser-api'

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
  } = useLoaderData();
  const { t } = useTranslation();

  return (
    <PlayerProvider>
      <div className="bg-blue-900">
        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto px-4 sm:px-8 lg:px-20 py-8 sm:py-10 lg:py-14 text-white">
            <div className="flex flex-col lg:flex-row lg:gap-60 gap-8">
              <div className="flex items-start">
                <div className="w-16 h-16 mr-4 rounded-full overflow-hidden border-white flex-shrink-0">
                  <img
                    src={getCountryFlag(countryCode)}
                    alt={`${countryCode} flag`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold capitalize mb-2">
                    <Truncate>{countryName}</Truncate>
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <span>{totalRecords}</span>
                      <span className="ml-1">{t("genreStations")}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 lg:max-w-2xl">
                <p className="text-white/80">
                  {description ||
                    t("countryDescription", { country: countryName })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-20 py-8">
          <h2 className="text-lg font-medium mb-6">{t("allStations")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stations.map(
              ({
                stationuuid,
                name,
                tags,
                clickCount,
                votes,
                language,
                url,
                country,
              }) => {
                return (
                  <RadioCard
                    key={`${stationuuid}`}
                    stationuuid={stationuuid}
                    name={name}
                    tags={tags || []}
                    clickcount={clickCount}
                    votes={votes}
                    language={language}
                    url={url}
                    country={country}
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
    </PlayerProvider>
  );
}
