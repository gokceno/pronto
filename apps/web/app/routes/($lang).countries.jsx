import { Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { CountryCard } from "../components/country-card.jsx";
import { useTranslation } from 'react-i18next';
import Pagination from "../components/pagination.jsx";

export const meta = () => [{ title: "Radio Stations by Country • Radio Pronto!" }];

export const loader = async ({ params, request }) => {
  const { lang } = params;
  const url = new URL(request.url);
  const currentPage = parseInt(url.searchParams.get("p")) || 1;
  const recordsPerPage = 24;

  const offset = (currentPage - 1) * recordsPerPage;

  const response = await fetch(
    `${process.env.RB_API_BASE_URL}/json/countries?order=stationcount&limit=${recordsPerPage}&offset=${offset}&reverse=true`,
    {
      headers: {
        "User-Agent": process.env.APP_USER_AGENT || "",
      },
    }
  );

  const statsResponse = await fetch(
    `${process.env.RB_API_BASE_URL}/json/stats`,
    {
      headers: {
        "User-Agent": process.env.APP_USER_AGENT || "",
      },
    }
  );

  const [countries, stats] = await Promise.all([
    response.json(),
    statsResponse.json()
  ]);

  const totalRecords = stats?.countries ?? 0;

  return json({
    countries,
    locale: lang,
    currentPage,
    totalRecords,
    recordsPerPage
  });
};

export default function Index() {
  const { t } = useTranslation();
  const { countries, currentPage, totalRecords, recordsPerPage } = useLoaderData();

  return (
    <div className="bg-white p-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <span className="text-xl font-bold mb-6">{t('countries')}</span>
        <div className="grid grid-cols-1 gap-5 justify-items-center mt-6
                       sm:grid-cols-2 
                       lg:grid-cols-4">
          {countries.map(({ name, stationcount, iso_3166_1 }) => (
            <CountryCard 
              key={`${iso_3166_1}`}
              name={name}
              countryCode={iso_3166_1}
              stationCount={stationcount} 
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
        <Outlet />
      </div>
    </div>
  );
}
