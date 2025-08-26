import Header from "../components/header";
import { useTranslation } from "react-i18next";
import SearchBar from "../components/search-bar";
import { useLoaderData } from "@remix-run/react";
import SearchSuggestions from "../components/search-suggestions";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { eq, sql } from "drizzle-orm";
import { authenticator } from "@pronto/auth/auth.server.js";
import { updateListeningCounts } from "../services/listening-count.server.js";

export const loader = async ({ params, request }) => {
  const user = await authenticator.isAuthenticated(request);

  const stations = await dbServer
    .select({
      id: dbSchema.radios.id,
      name: dbSchema.radios.radioName,
      url: dbSchema.radios.url,
      favicon: dbSchema.radios.favicon,
      country: dbSchema.radios.countryId,
      userScore: dbSchema.radios.userScore,
      tags: dbSchema.radios.radioTags,
      language: dbSchema.radios.radioLanguage,
    })
    .from(dbSchema.radios)
    .where(eq(dbSchema.radios.isDeleted, 0))
    .orderBy(sql`${dbSchema.radios.userScore} DESC`)
    .limit(4);

  // Get station IDs for listening count updates
  const stationIds = stations.map((station) => station.id);

  // Get listening counts for all stations (will update if needed)
  const listeningCounts = await updateListeningCounts(stationIds);

  // Add listening counts to stations data
  const stationsWithCounts = stations.map((station) => ({
    ...station,
    clickCount: listeningCounts[station.id] || 0,
    votes: 0, // Default value for votes as this field may not be readily available
  }));

  return {
    locale: params.lang,
    stations: stationsWithCounts,
    user,
  };
};

export default function SearchPage() {
  const { t } = useTranslation();
  const { locale, stations, user } = useLoaderData();
  const stationList = stations.map(
    ({
      id,
      name,
      url,
      country,
      userScore,
      tags,
      language,
      clickCount,
      votes,
    }) => ({
      id,
      name,
      url,
      country,
      userScore,
      tags,
      language,
      clickCount: clickCount || 0,
      votes: votes || 0,
    }),
  );

  return (
    <>
      <Header
        alwaysBlue={true}
        showSearch={false}
        user={user}
        locale={locale}
        isStatic={false}
      />
      <div className="w-full bg-white min-h-screen pt-24 px-20 flex flex-col items-center justify-start">
        <div className="w-[40rem] h-[10.5rem] gap-8 flex flex-col text-center">
          <div className="w-full h-20">
            <span className="font-jakarta text-[2rem] font-bold whitespace-pre-line">
              {t("listenWhat")}
            </span>
          </div>

          <SearchBar locale={locale} border={true} user={user} />
        </div>

        <SearchSuggestions
          t={t}
          locale={locale}
          stations={stations}
          stationList={stationList}
          user={user}
        />
      </div>
    </>
  );
}
