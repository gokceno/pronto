import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useTranslation } from "react-i18next";
import { GenreCard } from "../components/genre-card.jsx";
import Pagination from "../components/pagination.jsx"; 
import { RadioBrowserApi } from 'radio-browser-api'

export const loader = async ({ params, request }) => {
  const { lang } = params;
  const url = new URL(request.url);
  const api = new RadioBrowserApi(process.env.APP_TITLE)
  const currentPage = parseInt(url.searchParams.get("p")) || 1;
  const recordsPerPage = 24;
  const offset = (currentPage - 1) * recordsPerPage;
  const tags = await api.getTags(undefined, {
    offset,
    limit: recordsPerPage,
    order: 'stationcount',
    reverse: true
  });
  const totalRecords = tags.length;

  return json({
    genres: tags,
    locale: lang,
    currentPage,
    totalRecords,
    recordsPerPage,
  });
};

export default function Index() {
  const { t } = useTranslation();
  const { genres, currentPage, totalRecords, recordsPerPage, locale } =
    useLoaderData();

  return (
    <div className="bg-white p-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <span className="text-xl font-bold mb-6 block">{t("genres")}</span>
        <div
          className="grid grid-cols-1 gap-5 justify-items-center mt-6
                       sm:grid-cols-2 
                       lg:grid-cols-4"
        >
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
