import { Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/react";
import { CountryCard } from "../components/country-card.jsx";
import { useTranslation } from 'react-i18next';
import Pagination from "../components/pagination.jsx";
import Header from "../components/header.jsx";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { count, eq, desc } from "drizzle-orm";
import { authenticator } from "@pronto/auth/auth.server.js";

export const loader = async ({ params, request }) => {
  const user = await authenticator.isAuthenticated(request);
  const { lang } = params;
  const url = new URL(request.url);
  const currentPage = parseInt(url.searchParams.get("p")) || 1;
  const recordsPerPage = 24;
  const offset = (currentPage - 1) * recordsPerPage;
  const endIndex = offset + recordsPerPage;

  const stationCount = count(dbSchema.radios.id).as("stationCount");
  const countries = await dbServer
    .select({
      countryName: dbSchema.countries.countryName,
      iso: dbSchema.countries.iso,
      stationCount,
    })
    .from(dbSchema.countries)
    .where(eq(dbSchema.countries.isDeleted, 0))
    .leftJoin(dbSchema.radios, eq(dbSchema.radios.countryId, dbSchema.countries.id))
    .groupBy(dbSchema.countries.id)
    .orderBy(desc(stationCount));

  const totalRecords = countries.length;
  return json({
    countries,
    offset,
    endIndex,
    locale: lang,
    currentPage,
    totalRecords,
    recordsPerPage,
    user
  });
};

export default function Index() {
  const { t } = useTranslation();
  const { countries, currentPage, user, totalRecords, recordsPerPage, locale, offset, endIndex } = useLoaderData();

  return (
    <div>
      <Header locale={locale} userIconURL={user?.avatar} alwaysBlue={true} className="flex-shrink-0" />
      <div className="bg-white p-6 sm:px-6 lg:px-8">
        <div className="mx-auto mt-16 max-w-7xl">
          <span className="text-xl font-bold mb-6">{t('countries')}</span>
          <div className="grid grid-cols-1 gap-5 justify-items-center mt-6
                        sm:grid-cols-2 
                        lg:grid-cols-4">
            {countries.slice(offset, endIndex).map(({ countryName, stationCount, iso }) => (
                  <CountryCard
                    key={iso}
                    name={countryName}
                    countryCode={iso}
                    stationCount={stationCount}
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
    </div>
  );
}
