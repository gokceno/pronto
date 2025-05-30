import { useLoaderData } from "@remix-run/react";
import { PlayerProvider } from "../contexts/player.jsx";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { GenreCard } from "../components/genre-card.jsx";
import { CountryCard } from "../components/country-card.jsx";
import SearchBar from "../components/search-bar.jsx";
import SearchBarTabs from "../components/search-bar-tabs.jsx";
import { generateLocalizedRoute } from "../utils/generate-route.jsx";
import { RadioBrowserApi } from 'radio-browser-api'
import Header from "../components/header.jsx";


export const loader = async ({params}) => {
  const api = new RadioBrowserApi(process.env.APP_TITLE);  
  const genres = await api.getTags(undefined, {
    limit: 16,
    order: 'stationcount',
    reverse: true
  });
  const countries = await api.getCountries(undefined, {
    limit: 8,
    order: 'stationcount',
    reverse: true
  });
  const stations = await api.searchStations({
    order: "clickcount",
    reverse: true,
    limit: 6, 
    hideBroken: true,
  });

  return {
    genres,
    countries,
    stations,
    locale: params.lang,
  };
};

export default function Homepage() {
  const { t } = useTranslation();
  const { genres, countries, locale, stations } = useLoaderData();
  const stationList = stations.map(({ id, name, url, country, clickCount, votes }) => ({
    id,
    name,
    url,
    country,
    clickCount,
    votes,
  }));

  const BACKGROUND_CLASSES = {
    countries: "bg-blue-100",
    genres: "bg-white",
    default: "",
  };

  return (
    <>
        <PlayerProvider>
          <Header locale={locale} searchBarStatic={false} className="flex-shrink-0" />
          <div className="h-[25rem] w-full bg-[url('/assets/search_bar_bg.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
            <div className="w-[40rem] h-[14.5rem] flex flex-col mt-10 gap-8">
              <div className="text-center">
                <span className="text-white font-jakarta text-3xl font-bold whitespace-pre-line">
                  {t("searchHeader")}
                </span>
              </div>
              <SearchBar locale={locale} expandable={true} stationList={stationList} stations={stations}/>
              <SearchBarTabs locale={locale}/>
            </div>
          </div>
          <div className={`p-6 sm:px-6 lg:px-8 ${BACKGROUND_CLASSES.genres}`}>
            <div className="mx-auto max-w-7xl px-5">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl/[1.75rem] text-[#00192C] font-jakarta font-semibold">{t("genres")}</span>
                <Link
                  to={generateLocalizedRoute(locale, "/genres")}
                  className="text-blue-500 hover:scale-105 transition-all border font-bold border-gray-400 rounded-full px-4 py-2"
                >
                  {t("showAll")}
                </Link>
              </div>
              <div
                className="grid grid-cols-1 gap-5 justify-items-center
                          sm:grid-cols-2 
                          lg:grid-cols-4"
              >
                {genres.slice(0, 16).map((genre, index) => (
                  <GenreCard
                    key={genre.name}
                    name={genre.name}
                    stationcount={genre.stationcount}
                    locale={locale}
                    index={index}
                  />
                ))}
              </div>
              <div className="h-5"/>
            </div>
          </div>

          <div className="min-h-[25rem] w-full p-20 flex flex-col items-center text-center justify-center bg-[url('/assets/banner.png')]
           bg-cover bg-center bg-no-repeat">
              <span className="text-[2rem]/[2.5rem] text-[#FFFFFF] font-jakarta font-semibold mb-2">{t("bannerTitle")}</span>
              <span className="mb-10 whitespace-pre-line text-[1.25rem]/[1.75rem] text-[#FFFFFF] font-jakarta font-normal">{t("bannerDescription")}</span>
              <Link
                to={generateLocalizedRoute(locale, "/login")}
                className="bg-[#E6E953] w-[16.5rem] h-[3.5rem] 
                flex items-center justify-center
                text-[#00192C] text-[1rem]/[1.5rem] font-jakarta font-semibold rounded-full transition-all hover:scale-105"
              >
                {t("signIn")}
              </Link>
          </div>
          

          <div className={`p-6 sm:px-6 lg:px-8 ${BACKGROUND_CLASSES.countries}`}>

            <div className="mx-auto max-w-7xl px-5">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl/[1.75rem] text-[#00192C] font-jakarta font-semibold">{t("countries")}</span>
                <Link
                  to={generateLocalizedRoute(locale, "/countries")}
                  className="text-blue-500 hover:scale-105 transition-all border font-bold border-gray-400 rounded-full px-4 py-2"
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
 
    </>
  );
}
