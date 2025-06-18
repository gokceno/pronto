import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { GenreCard } from "../components/genre-card.jsx";
import Pagination from "../components/pagination.jsx";
import Header from "../components/header.jsx";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { eq } from "drizzle-orm";
import { authenticator } from "@pronto/auth/auth.server.js";

export const loader = async ({ params, request }) => {
  const user = await authenticator.isAuthenticated(request);

  const { lang } = params;
  const url = new URL(request.url);
  const currentPage = parseInt(url.searchParams.get("p")) || 1;
  const recordsPerPage = 24;
  const offset = (currentPage - 1) * recordsPerPage;
  const endIndex = offset + recordsPerPage;

  const radiosTags = await dbServer
    .select({ radioTags: dbSchema.radios.radioTags })
    .from(dbSchema.radios)
    .where(eq(dbSchema.radios.isDeleted, 0));

  const tagCounts = {};
  radiosTags.forEach(({ radioTags }) => {
    let tags = [];
    try {
      tags = JSON.parse(radioTags);
    } catch (e) {
      console.error("Error parsing radioTags:", e);
    }
    tags.forEach((tag) => {
      if (!tag) return;
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const genres = Object.entries(tagCounts)
    .map(([name, stationcount]) => ({ name, stationcount }))
    .sort((a, b) => b.stationcount - a.stationcount);

  const totalRecords = genres.length;
  return json({
    genres,
    offset,
    user,
    endIndex,
    locale: lang,
    currentPage,
    totalRecords,
    recordsPerPage,
  });
};

export default function Index() {
  const { t } = useTranslation();
  const {
    genres,
    currentPage,
    totalRecords,
    user,
    recordsPerPage,
    locale,
    offset,
    endIndex,
  } = useLoaderData();

  return (
    <div>
      <Header
        locale={locale}
        user={user}
        alwaysBlue={true}
        className="flex-shrink-0"
      />
      <div className="bg-white p-6 sm:px-6 lg:px-8">
        <div className="mx-auto mt-16 max-w-7xl">
          <span className="text-xl font-bold mb-6 block">{t("genres")}</span>
          <div
            className="grid grid-cols-1 gap-5 justify-items-center mt-6
                        sm:grid-cols-2
                        lg:grid-cols-4"
          >
            {genres.slice(offset, endIndex).map((genre, index) => (
              <GenreCard
                key={genre.name}
                name={genre.name}
                stationcount={genre.stationcount}
                locale={locale}
                index={index}
              />
            ))}
          </div>
          <div className="mt-8 mb-4 flex justify-center">
            <Pagination
              totalRecords={totalRecords}
              recordsPerPage={recordsPerPage}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
