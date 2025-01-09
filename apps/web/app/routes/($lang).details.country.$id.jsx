import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { PlayerProvider } from "../contexts/player";
import Truncate from "../components/truncate.jsx";
import { getCountryFlag } from "../components/country-card";
import Pagination from "../components/pagination.jsx";
import RadioCard from "../components/radio-card.jsx";
import { generateDescription } from "../openai.server.js";
import { getCachedDescription, setCachedDescription } from "../genre-cache.server.js";

export const loader = async ({ params, request }) => {
  const { id: countryCode } = params;
  const url = new URL(request.url);
  const currentPage = parseInt(url.searchParams.get("p")) || 1;
  const recordsPerPage = 12;
  const offset = (currentPage - 1) * recordsPerPage;

  try {
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
    console.log(stations);

    // Extract genres from stations
    const genres = [...new Set(stations.flatMap(station => 
      station.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    ))];

    let description = await getCachedDescription(countryCode);

    if (!description) {
      description = await generateDescription(countryCode);
      setCachedDescription(countryCode, description);
    }

    return json({
      countryCode,
      countryName: countryData.name,
      stations,
      totalRecords,
      currentPage,
      recordsPerPage,
      description,
      genres: genres.slice(0, 5),
    });

  } catch (error) {
    console.error('Error in country details loader:', error);
    return json({
      countryCode,
      countryName: '',
      stations: [],
      totalRecords: 0,
      currentPage: 1,
      recordsPerPage,
      genres: [],
    });
  }
};

export default function CountryDetails() {
  const { countryCode, countryName, stations, totalRecords, currentPage, recordsPerPage, genres, description } = useLoaderData();
  const { t } = useTranslation();

  return (
    <PlayerProvider>
      <div className="bg-blue-900">
        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto px-4 sm:px-8 lg:px-20 py-8 sm:py-10 lg:py-14 text-white">
            <div className="flex flex-col lg:flex-row lg:gap-60 gap-8">
              <div className="flex items-start">
                <div className="w-16 h-16 mr-4 rounded-full overflow-hidden border-white flex-shrink-0">
                  <img src={getCountryFlag(countryCode)} alt={`${countryCode} flag`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold capitalize mb-2">
                    <Truncate>{countryName}</Truncate>
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <span>{totalRecords}</span>
                      <span className="ml-1">{t('genreStations')}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 lg:max-w-2xl">
                <p className="text-white/80">
                  {description || t('countryDescription', { country: countryName })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre, index) => (
                    <span key={index} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs sm:text-sm">
                      {genre}
                    </span>
                  ))}
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