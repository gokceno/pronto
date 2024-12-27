import { useLoaderData } from "@remix-run/react";
import { PlayerProvider } from "../contexts/player.jsx";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { json } from "@remix-run/node";
import { GenreCard } from "../components/genre-card.jsx";
import { GenreCardContainer } from "../components/genre-card-container.jsx";

export const loader = async () => {
  const response = await fetch(
    `${process.env.RB_API_BASE_URL}/json/tags?order=stationcount&limit=8&reverse=true`,
    {
      headers: {
        "User-Agent": process.env.APP_USER_AGENT || "",
      },
    },
  );

  return json({
    genres: await response.json(),
  });
};

export default function Homepage() {
  const { t } = useTranslation();
  const { genres } = useLoaderData();
  
  return (
    <>
      <PlayerProvider>
        <div className="bg-gradient min-h-[400px] py-20">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h1 className="text-white text-3xl font-bold mb-8">
              {t("searchHeader")}
            </h1>

            <div className="flex items-center gap-2 bg-white rounded-lg p-1 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={t("searchBarTitle")}
                  className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                />
              </div>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 3v18m4-12v12m4-16v16m4-10v10M4 7v10"
                  />
                </svg>
                {t("stations")}
              </button>
            </div>

            <div className="flex justify-center space-x-2 mt-6">
              {[
                "Pop",
                "R&B",
                "Indie",
                "Metal",
                "Country",
                "Rock",
                "Hits",
                "Dance",
              ].map((genre) => (
                <button
                  key={genre}
                  className="px-4 py-1 rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
        <GenreCardContainer>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full ">
          {genres.map((genre) => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </div>
        </GenreCardContainer>

      </PlayerProvider>
      <footer className="bg-[#0E1217] text-white py-3 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <img
              src="/assets/pronto_radio_icon.png"
              alt="Pronto Radio"
              className="h-8"
            />
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>Tüm hakları saklıdır 2023 ©RadioPronto</span>
              <span>Kişisel Verilerin İşlenmesi</span>
              <span>Çerez Ayarları</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a href="https://apps.apple.com/download">
              <img
                src="/assets/apple_store_download.png"
                alt="Download on App Store"
                className="h-10"
              />
            </a>
            <a href="https://play.google.com/store/download">
              <img
                src="/assets/google_play_download.png"
                alt="Get it on Google Play"
                className="h-10"
              />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}