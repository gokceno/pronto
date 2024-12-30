import { useLoaderData } from "@remix-run/react";
import { PlayerProvider } from "../contexts/player.jsx";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { json } from "@remix-run/node";
import { GenreCard } from "../components/genre-card.jsx";
import { useNavigate } from "@remix-run/react";
import Footer from "../components/footer.jsx";
import { CountryCard } from "../components/country-card.jsx";
import { CardContainer } from "../components/card-container.jsx";
import  SearchBar  from "../components/search-bar.jsx";
import SearchBarTabs from "../components/search-bar-tabs.jsx";


export const loader = async () => {
  const response = await fetch(
    `${process.env.RB_API_BASE_URL}/json/tags?order=stationcount&limit=8&reverse=true`,
    {
      headers: {
        "User-Agent": process.env.APP_USER_AGENT || "",
      },
    },
  );
  const responseCountries = await fetch(
    // eslint-disable-next-line no-undef
    `${process.env.RB_API_BASE_URL}/json/countries?order=stationcount&limit=8&reverse=true`,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "User-Agent": process.env.APP_USER_AGENT || "",
      },
    },
  )

  return {
    genres: await response.json(), 
    countries: await responseCountries.json(),
  };
};

export default function Homepage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { genres, countries } = useLoaderData();

  return (
    <>
      <PlayerProvider>
        <div className="bg-gradient min-h-[400px] py-20">
          <SearchBar />
          <SearchBarTabs />
        </div>
        <CardContainer type="genres">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {genres.map(({ id, name, stationcount }, index) => (
            <GenreCard 
              key={`${id}-${index}`}
              id={id}
              name={name}
              stationcount={stationcount}
            />
          ))}
          </div>
        </CardContainer>
        <CardContainer type="countries">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {countries.map(({ name, stationcount, iso_3166_1 }, index) => (
              <CountryCard 
                key={`${iso_3166_1}-${index}`}
                name={name}
                countryCode={iso_3166_1}
                stationCount={stationcount} 
              />
            ))}
          </div>
        </CardContainer>

      </PlayerProvider>
      <Footer />
    </>
  );
}