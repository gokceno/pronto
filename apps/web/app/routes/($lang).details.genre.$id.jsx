import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { PlayerProvider } from "../contexts/player";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { generateGenreDescription } from "../openai.server.js";
import { getCachedDescription, setCachedDescription } from "../genre-cache.server.js";
import Pagination from "../components/pagination.jsx";
import RadioCard from "../components/radio-card.jsx";

export const loader = async ({ params, request }) => {
  const { id: genre } = params;
  const url = new URL(request.url);
  const currentPage = parseInt(url.searchParams.get("p")) || 1;
  const recordsPerPage = 12;
  const offset = (currentPage - 1) * recordsPerPage;

  try {
    // First, fetch the tag info to get the station count
    const [tagResponse, cachedDescription] = await Promise.all([
      fetch(
        `${process.env.RB_API_BASE_URL}/json/tags/${genre}`,
        {
          headers: {
            "User-Agent": process.env.APP_USER_AGENT || "",
          },
        }
      ),
      getCachedDescription(genre)
    ]);

    if (!tagResponse.ok) {
      throw new Error('Failed to fetch tag data from Radio Browser API');
    }

    const tagInfo = await tagResponse.json();
    const totalRecords = tagInfo.reduce((sum, tag) => sum + (tag?.stationcount || 0), 0);
    // Then fetch only the stations we need using offset and limit
    const stationsResponse = await fetch(
      `${process.env.RB_API_BASE_URL}/json/stations/bytagexact/${genre}?hidebroken=true&offset=${offset}&limit=${recordsPerPage}`,
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

    let description = cachedDescription;
    
    if (!description) {
      description = await generateGenreDescription(genre);
      await setCachedDescription(genre, description);
    }

    const totalVotes = stations.reduce((sum, station) => {
      const votes = parseInt(station.votes);
      return sum + (isNaN(votes) ? 0 : votes);
    }, 0);

    return json({
      genre,
      stations,
      description,
      countries: stations
        .map(station => ({ name: station.country }))
        .filter((country, index, self) => 
          country.name && 
          self.findIndex(c => c.name === country.name) === index
        )
        .slice(0, 8),
      stationCount: totalRecords,
      likeCount: totalVotes,
      currentPage,
      totalRecords, 
      recordsPerPage
    });
    
  } catch (error) {
    console.error('Error in genre details loader:', error);
    return json({
      genre,
      stations: [],
      description: null,
      countries: [],
      stationCount: 0,
      likeCount: 0,
      currentPage: 1,
      totalRecords: 0,
      recordsPerPage
    });
  }
};

export default function GenreDetails() {
  const { genre, stations, countries, stationCount, likeCount, description, currentPage, totalRecords, recordsPerPage } = useLoaderData();
  const { t } = useTranslation();

  return (
    <PlayerProvider>
      <div className="bg-blue-900">
        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto px-4 sm:px-8 lg:px-20 py-8 sm:py-10 lg:py-14 text-white">
            <div className="flex flex-col lg:flex-row lg:gap-60 gap-8">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold capitalize mb-2">{genre}</h1>
                <div className="flex items-center gap-2 mb-4 sm:mb-6 lg:mb-8">
                  <div className="flex items-center">
                    <span>{stationCount}</span>
                    <span className="ml-1">{t('genreStations')}</span>
                  </div>
                  <span className="text-xl sm:text-2xl"><DotFilledIcon /></span>
                  <div className="flex items-center">
                    <span>{likeCount}</span>
                    <span className="ml-1">{t('likes')}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 lg:max-w-2xl">
                <p className="text-white/80">
                  {description || t(genre.toLowerCase() in specialGenres ? "newsDescription" : "genreDescription", { genre })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {countries.map((country) => (
                    <span 
                      key={country.name} 
                      className="px-3 sm:px-4 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs sm:text-sm"
                    >
                      {country.name}
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