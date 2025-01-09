import { useLoaderData } from "@remix-run/react";
import { PlayerProvider } from "../contexts/player.jsx";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { GenreCard } from "../components/genre-card.jsx";
import { CountryCard } from "../components/country-card.jsx";
import SearchBar from "../components/search-bar.jsx";
import SearchBarTabs from "../components/search-bar-tabs.jsx";
import { generateLocalizedRoute } from "../utils/generate-route.jsx";

export const loader = async ({ params }) => {
  const response = await fetch(
    `${process.env.RB_API_BASE_URL}/json/tags?order=stationcount&limit=8&reverse=true&hidebroken=true`,
    {
      headers: {
        "User-Agent": process.env.APP_USER_AGENT || "",
      },
    }
  );
  const responseCountries = await fetch(
    `${process.env.RB_API_BASE_URL}/json/countries?order=stationcount&limit=8&reverse=true`,
    {
      headers: {
        "User-Agent": process.env.APP_USER_AGENT || "",
      },
    }
  );

  return {
    genres: await response.json(),
    countries: await responseCountries.json(),
    locale: params.lang,
  };
};

export default function Homepage() {
  const { t } = useTranslation();
  const { genres, countries, locale } = useLoaderData();

  const BACKGROUND_CLASSES = {
    countries: "bg-blue-100",
    genres: "bg-white",
    default: "",
  };

  return (
    <>
      <div>
        <PlayerProvider>
          <div className="bg-gradient min-h-[400px] py-20">
            <SearchBar />
            <SearchBarTabs />
          </div>
          <div className={`p-6 sm:px-6 lg:px-8 ${BACKGROUND_CLASSES.genres}`}>
            <div className="mx-auto max-w-7xl px-5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[20px] font-bold">{t("genres")}</h2>
                <Link
                  to={generateLocalizedRoute(locale, "/genres")}
                  className="text-blue-500 hover:text-blue-600 border font-bold border-gray-400 rounded-full px-4 py-2"
                >
                  {t("showAll")}
                </Link>
              </div>
              <div
                className="grid grid-cols-1 gap-5 justify-items-center
                            sm:grid-cols-2 
                            lg:grid-cols-4"
              >
                {genres.slice(0, 8).map((genre) => (
                  <GenreCard
                    key={genre.name}
                    name={genre.name}
                    stationcount={genre.stationcount}
                    locale={locale}
                  />
                ))}
              </div>
            </div>
          </div>
          <div
            className={`p-6 sm:px-6 lg:px-8 ${BACKGROUND_CLASSES.countries}`}
          >
            <div className="mx-auto max-w-7xl px-5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[20px] font-bold">{t("countries")}</h2>
                <Link
                  to={generateLocalizedRoute(locale, "/countries")}
                  className="text-blue-500 hover:text-blue-600 border font-bold border-gray-400 rounded-full px-4 py-2"
                >
                  {t("showAll")}
                </Link>
              </div>
              <div
                className="grid grid-cols-1 gap-5 justify-items-center
                            sm:grid-cols-2 
                            lg:grid-cols-4"
              >
                {countries
                  .slice(0, 12)
                  .map(({ name, stationcount, iso_3166_1 }) => (
                    <CountryCard
                      key={iso_3166_1}
                      name={name}
                      countryCode={iso_3166_1}
                      stationCount={stationcount}
                    />
                  ))}
              </div>
            </div>
          </div>
        </PlayerProvider>
      </div>
    </>
  );
}
