import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { HeartIcon, Share1Icon } from "@radix-ui/react-icons";


export const loader = async ({ params }) => {
  const { type, id, lang } = params;
  
  // Fetch stations based on type (genre or country)
  const response = await fetch(
    `${process.env.RB_API_BASE_URL}/json/stations/${type === 'genre' ? 'bytag' : 'bycountry'}/${id}`,
    {
      headers: {
        "User-Agent": process.env.APP_USER_AGENT || "",
      },
    }
  );

  // Get stats for tag/country counts
  const statsResponse = await fetch(
    `${process.env.RB_API_BASE_URL}/json/${type === 'genre' ? 'tags' : 'countries'}`,
    {
      headers: {
        "User-Agent": process.env.APP_USER_AGENT || "",
      },
    }
  );

  // Get countries that play this genre
  const countriesResponse = await fetch(
    `${process.env.RB_API_BASE_URL}/json/countries/bytag/${id}?limit=10&reverse=true`,
    {
      headers: {
        "User-Agent": process.env.APP_USER_AGENT || "",
      },
    }
  );

  const [stations, stats, countries] = await Promise.all([
    response.json(),
    statsResponse.json(),
    countriesResponse.json()
  ]);

  return json({
    type,
    id,
    locale: lang,
    stationCount: stations.length,
    totalLikes: stations.reduce((acc, station) => acc + (station.votes || 0), 0),
    stations,
    countries: countries.slice(0, 9), // Take top 9 countries as shown in design
    description: t('genreDescription', { genre: id })
  });
};

export default function Details() {
  const { type, id, stationCount, totalLikes, stations, countries, description } = useLoaderData();
  const { t } = useTranslation();

  const title = type === 'genre' ? id : stations[0]?.country || id;

  return (
    <div className="relative min-h-[300px] bg-gradient-to-r from-blue-950 to-blue-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-8">
          <button className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold capitalize mb-2">{title}</h1>
              <button className="flex items-center gap-2 hover:text-blue-300">
                <Share1Icon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span>{t('cardStations', { count: stationCount })}</span>
              <button className="flex items-center gap-2 hover:text-blue-300">
                <HeartIcon className="h-5 w-5" />
                {totalLikes} {t('likes')}
              </button>
            </div>
            <p className="text-gray-300 mb-6">{description}</p>
            <div className="flex flex-wrap gap-2">
              {countries.map((country) => (
                <span key={country.name} className="px-4 py-2 bg-blue-800/50 rounded-full text-sm hover:bg-blue-800 cursor-pointer">
                  {country.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 