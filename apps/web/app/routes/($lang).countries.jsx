import { Outlet, Link, useLoaderData, useMatches } from "@remix-run/react";
import { json } from "@remix-run/node";
import { CountryCard } from "../components/country-card.jsx";
import { useTranslation } from 'react-i18next';

export const meta = () => [{ title: "Radio Stations by Country • Radio Pronto!" }];

export const loader = async () => {
  // eslint-disable-next-line no-undef
  const recordsPerPage = process.env.NUM_OF_COUNTRIES_PER_PAGE || 30;
  const response = await fetch(
    // eslint-disable-next-line no-undef
    `${process.env.RB_API_BASE_URL}/json/countries?order=stationcount&limit=${recordsPerPage}&reverse=true`,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "User-Agent": process.env.APP_USER_AGENT || "",
      },
    },
  );
  return json({
    countries: await response.json(),
  });
};

export default function Index() {
  const { t } = useTranslation();
  const { countries, locale } = useLoaderData();
  const matches = useMatches();
  const country = matches.filter((m) => m.id === "root")[0]?.params?.country;
  return (
    <div className="bg-white p-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t('countries')}</h2>
      </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
          lg:grid-cols-4 gap-6 w-full">
              {countries.map(({ name, stationcount, iso_3166_1 }) => (
                <CountryCard 
                  key={`${iso_3166_1}`}
                  name={name}
                  countryCode={iso_3166_1}
                  stationCount={stationcount} 
                />
              ))}
            </div>
      
      <Outlet />
    </div>
  );
}
