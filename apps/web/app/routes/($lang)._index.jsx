import { useLoaderData } from "@remix-run/react";
import { PlayerProvider } from "../contexts/player.jsx";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { json } from "@remix-run/node";

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
        <header className="bg-blue-800 text-white py-4 px-6 shadow-md flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <img
                src="/assets/pronto_radio_icon.png"
                alt="Pronto Radio"
                className="h-8 mr-2"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                {t("homePage")}
              </Link>
              <Link to="/turler" className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 8a2 2 0 11-4 0 2 2 0 014 0zM18 14a4 4 0 00-8 0" />
                </svg>
                {t("genres")}
              </Link>
              <Link to="/dunyadan" className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                {t("countries")}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="bg-yellow-400 text-black px-4 py-2 rounded-full flex items-center font-medium">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              {t("createRadioList")}
            </button>
            <button className="bg-blue-600/20 p-2 rounded-full">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </button>
          </div>
        </header>
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
        <div className="container mx-auto p-4 mt-6">
          <div className="flex">
            <ul>
              {genres.map((genre) => (
                <li key={genre.id}>{genre.name}</li>
              ))}
            </ul>
          </div>
        </div>
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
