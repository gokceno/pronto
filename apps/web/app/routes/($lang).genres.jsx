import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useTranslation } from 'react-i18next';
import { GenreCard } from "../components/genre-card.jsx";
import Pagination from "../components/pagination.jsx"; 

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
  const { genres, currentPage, totalRecords, recordsPerPage, locale } = useLoaderData();
  
  return (
    <div className="bg-white p-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <span className="text-xl font-bold mb-6 block">{t('genres')}</span>
        <div className="grid grid-cols-1 gap-5 justify-items-center mt-6
                       sm:grid-cols-2 
                       lg:grid-cols-4">
          {genres.slice(0, 24).map((genre, index) => (
            <GenreCard
              key={index}
              id={genre.name}
              name={genre.name}
              stationcount={genre.stationcount}
              locale={locale}
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
