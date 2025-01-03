import { useLoaderData, useMatches } from "@remix-run/react";
import { json } from "@remix-run/node";
import Truncate from "../components/truncate.jsx";
import { useTranslation } from 'react-i18next';
import { GenreCard } from "../components/genre-card.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"


export const loader = async ({ params }) => {
  const { lang } = params;
  // eslint-disable-next-line no-undef
  const recordsPerPage = process.env.NUM_OF_GENRES_PER_PAGE || 30;
  const response = await fetch(
    // eslint-disable-next-line no-undef
    `${process.env.RB_API_BASE_URL}/json/tags?order=stationcount&limit=${recordsPerPage}&reverse=true`,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "User-Agent": process.env.APP_USER_AGENT || "",
      },
    },
  );

  return json({
    genres: await response.json(),
    locale: lang 
  });
};

export default function Index() {
  const { t } = useTranslation();
  const { genres, locale } = useLoaderData();
  const matches = useMatches();
  const genre = matches.filter((m) => m.id === "root")[0]?.params?.genre;
  
  return (
    <div className="bg-white p-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-xl font-bold mb-6">{t('genres')}</h2>

        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => console.log('Button clicked!')}
        >
          Click me
        </button>

        
        <div className="grid grid-cols-1 gap-5 justify-items-center
                              sm:grid-cols-2 
                              lg:grid-cols-4">
          {genres.map(({ id, name, stationcount }) => (
            <GenreCard 
              key={`${id}`}
              id={id}
              name={name}
              stationcount={stationcount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
