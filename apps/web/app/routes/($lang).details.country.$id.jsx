import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { PlayerProvider } from "../contexts/player";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { getCountryFlag } from "../components/country-card";
import Pagination from "../components/pagination.jsx";
import RadioCard from "../components/radio-card.jsx";

export const loader = async ({ params, request }) => {
  const { id: countryCode } = params;
  const url = new URL(request.url);
  const currentPage = parseInt(url.searchParams.get("p")) || 1;
  const recordsPerPage = 12;
  const offset = (currentPage - 1) * recordsPerPage;

  try {
    // Fetch country info to get the station count
    const countryResponse = await fetch(
      `${process.env.RB_API_BASE_URL}/json/countries/${countryCode}?hidebroken=true`,
      {
        headers: {
          "User-Agent": process.env.APP_USER_AGENT || "",
        },
      }
    );

    if (!countryResponse.ok) {
      throw new Error('Failed to fetch country data from Radio Browser API');
    }

    const countryInfo = await countryResponse.json();
    const countryData = countryInfo[0] || { name: '', stationcount: 0 };    
    const totalRecords = countryData.stationcount;

    // Fetch stations for the country
    const stationsResponse = await fetch(
      `${process.env.RB_API_BASE_URL}/json/stations/bycountrycodeexact/${countryCode}?hidebroken=true&offset=${offset}&limit=${recordsPerPage}`,
      {
        headers: {
          "User-Agent": process.env.APP_USER_AGENT || "",
        },
      }
    );

    if (!stationsResponse.ok) {
      throw new Error('Failed to fetch stations data from Radio Browser API');
    }

    const stations = await stationsResponse.json();

    return json({
      countryCode,
      stations,
      totalRecords,
      currentPage,
      recordsPerPage,
    });

  } catch (error) {
    console.error('Error in country details loader:', error);
    return json({
      countryCode,
      stations: [],
      totalRecords: 0,
      currentPage: 1,
      recordsPerPage,
    });
  }
};

export default function CountryDetails() {
  const { countryCode, stations, totalRecords, currentPage, recordsPerPage } = useLoaderData();
  const { t } = useTranslation();

  return (
    <PlayerProvider>
      <div className="bg-blue-900">
        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto px-4 sm:px-8 lg:px-20 py-8 sm:py-10 lg:py-14 text-white">
            <div className="flex flex-col lg:flex-row lg:gap-60 gap-8">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold capitalize mb-2">
                  {t('countryDescription', { country: countryCode })}
                </h1>
                <div className="flex items-center gap-2 mb-4 sm:mb-6 lg:mb-8">
                  <div className="flex items-center">
                    <span>{totalRecords}</span>
                    <span className="ml-1">{t('genreStations')}</span>
                  </div>
                  <span className="text-xl sm:text-2xl"><DotFilledIcon /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">            
        <div className="max-w-7xl mx-auto px-20 py-8">
          <h2 className="text-lg font-medium mb-6">{t('allStations')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stations.map(({ stationuuid, name, tags, clickcount, votes, language, url, country }) => (
              <RadioCard
                key={stationuuid}
                stationuuid={stationuuid}
                name={name}
                tags={tags}
                clickcount={clickcount}
                votes={votes}
                language={language}
                url={url}
                country={country}
              />
            ))}
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
