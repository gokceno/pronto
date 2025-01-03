import { useLoaderData, useMatches, useSearchParams } from "@remix-run/react";
import { json } from "@remix-run/node";
import Truncate from "../components/truncate.jsx";
import { useTranslation } from 'react-i18next';
import { GenreCard } from "../components/genre-card.jsx";
import Pagination from "../components/pagination.jsx"; // Make sure to import the Pagination component

export const loader = async ({ params, request }) => {
  const { lang } = params;
  const url = new URL(request.url);
  const currentPage = parseInt(url.searchParams.get("p")) || 1;
  const recordsPerPage = 24;

  const offset = (currentPage - 1) * recordsPerPage;
  const tagsResponse = await fetch(
    `${process.env.RB_API_BASE_URL}/json/tags?order=stationcount&limit=${recordsPerPage}&offset=${offset}&reverse=true`,
    {
      headers: {
        "User-Agent": process.env.APP_USER_AGENT || "",
      },
    },
  );

  const statsResponse = await fetch(
    `${process.env.RB_API_BASE_URL}/json/stats`,
    {
      headers: {
        "User-Agent": process.env.APP_USER_AGENT || "",
      },
    },
  );


  const [genres, stats] = await Promise.all([
    tagsResponse.json(),
    statsResponse.json()
  ]);
  
  const totalRecords = stats?.tags ?? 0;

  return json({
    genres,
    locale: lang,
    currentPage,
    totalRecords, 
    recordsPerPage
  });
};

export default function Index() {
  const { t } = useTranslation();
  const { genres, locale, currentPage, totalRecords, recordsPerPage } = useLoaderData();
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
        <div className="mt-8 flex justify-center">
          <Pagination
            totalRecords={totalRecords}
            recordsPerPage={recordsPerPage}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
}
