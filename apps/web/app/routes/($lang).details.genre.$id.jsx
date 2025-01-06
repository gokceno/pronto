import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { PlayerProvider } from "../contexts/player";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { generateGenreDescription } from "../openai.server.js";
import { getCachedDescription, setCachedDescription } from "../genre-cache.server.js";

export const loader = async ({ params }) => {
  const { id: genre } = params;
  
  try {
    const [tagsResponse, cachedDescription] = await Promise.all([
      fetch(
        `${process.env.RB_API_BASE_URL}/json/stations/bytagexact/${genre}?hidebroken=true`,
        {
          headers: {
            "User-Agent": process.env.APP_USER_AGENT || "",
          },
        }
      ),
      getCachedDescription(genre)
    ]);

    if (!tagsResponse.ok) {
      throw new Error('Failed to fetch data from Radio Browser API');
    }

    let stations = [];
    let description = cachedDescription;
    
    try {
      stations = await tagsResponse.json();
      
      // Generate description only if not cached
      if (!description) {
        description = await generateGenreDescription(genre);
        await setCachedDescription(genre, description);
      }
    } catch (e) {
      console.error('Failed to parse API response:', e);
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
      stationCount: stations.length,
      likeCount: totalVotes 
    });

  } catch (error) {
    console.error('Error in genre details loader:', error);
    return json({
      genre,
      stations: [],
      description: null,
      countries: [],
      stationCount: 0,
      likeCount: 0
    });
  }
};

export default function GenreDetails() {
  const { genre, stations, countries, stationCount, likeCount, description } = useLoaderData();
  const { t } = useTranslation();

  return (
    <PlayerProvider>
      <div className="bg-blue-900">
        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto px-20 py-14 text-white">
            <div className="flex gap-60">
              <div>
                <h1 className="text-4xl font-bold capitalize mb-2">{genre}</h1>
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex items-center">
                    <span>{stationCount}</span>
                    <span className="ml-1">{t('genreStations')}</span>
                  </div>
                  <span className="text-2xl"><DotFilledIcon /></span>
                  <div className="flex items-center">
                    <span>{likeCount}</span>
                    <span className="ml-1">{t('likes')}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8 max-w-2xl">
              <p className="text-white/80">
                {description || t(genre.toLowerCase() in specialGenres ? "newsDescription" : "genreDescription", { genre })}
              </p>
                <div className="flex flex-wrap gap-2">
                  {countries.map((country) => (
                    <span 
                      key={country.name} 
                      className="px-4 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm"
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
    </PlayerProvider>
  );
}

