import { Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/react";
import { CountryCard } from "../components/country-card.jsx";
import { useTranslation } from 'react-i18next';
import Pagination from "../components/pagination.jsx";
import { RadioBrowserApi } from 'radio-browser-api'
import Header from "../components/header.jsx";


export const loader = async ({ params, request }) => {
  const { lang } = params;
  const url = new URL(request.url);
  const api = new RadioBrowserApi(process.env.APP_TITLE);  
  const currentPage = parseInt(url.searchParams.get("p")) || 1;
  const recordsPerPage = 24;
  const offset = (currentPage - 1) * recordsPerPage;
  const endIndex = offset + recordsPerPage;
  const countries = await api.getCountries(undefined, {
    order: 'stationcount',
    reverse: true
  });
  const totalRecords = countries.length;
  return json({
    countries,
    offset,
    endIndex,
    locale: lang,
    currentPage,
    totalRecords,
    recordsPerPage
  });
};

export default function Index() {
  const { t } = useTranslation();
  const { countries, currentPage, totalRecords, recordsPerPage, locale, offset, endIndex } = useLoaderData();

  return (
    <div>
      <Header locale={locale} alwaysBlue={true} className="flex-shrink-0" />
      <div className="bg-white p-6 sm:px-6 lg:px-8">
        <div className="mx-auto mt-16 max-w-7xl">
          <span className="text-xl font-bold mb-6">{t('countries')}</span>
          <div className="grid grid-cols-1 gap-5 justify-items-center mt-6
                        sm:grid-cols-2 
                        lg:grid-cols-4">
            {countries.slice(offset, endIndex).map(({ name, stationcount, iso_3166_1 }) => (
              <CountryCard 
                key={`${iso_3166_1}`}
                name={name}
                countryCode={iso_3166_1}
                stationCount={stationcount} 
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
          <Outlet />
        </div>
      </div>
    </div>
  );
}
