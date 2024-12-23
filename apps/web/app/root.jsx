import {
  Links,
  Meta,
  Outlet,
  Scripts,
  Link,
  useMatches,
} from "@remix-run/react";
import { PlayerProvider } from "./contexts/player.jsx";
import MiniAudioPlayer from "./components/mini-audio-player.jsx";
import stylesheet from "./tailwind.css?url";

export const meta = () => [{ title: "Radio Pronto!" }];
export const links = () => [{ rel: "stylesheet", href: stylesheet }];

export function Layout({ children }) {
  const matches = useMatches();
  const unSelectedClassNames =
    "text-blue-600 font-mono text-sm hover:bg-green-400 px-2 py-0.5 rounded";
  const selectedClassNames =
    "text-white font-mono text-sm bg-blue-800 px-2 py-0.5 rounded";

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta charSet="utf-8" />  
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100">
        <PlayerProvider>
        <header className="bg-blue-800 text-white py-4 px-6 shadow-md flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <img src="/assets/pronto_radio_icon.png" alt="Pronto Radio" className="h-8 mr-2" />
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Anasayfa
              </Link>
              <Link to="/turler" className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 8a2 2 0 11-4 0 2 2 0 014 0zM18 14a4 4 0 00-8 0" />
                </svg>
                Türler
              </Link>
              <Link to="/dunyadan" className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                Dünyadan
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-yellow-400 text-black px-4 py-2 rounded-full flex items-center font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Radyo listesi oluştur
            </button>
            <button className="bg-blue-600/20 p-2 rounded-full">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </button>
            <MiniAudioPlayer />
          </div>

        </header>

        <div className="bg-gradient min-h-[400px] py-20">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h1 className="text-white text-3xl font-bold mb-8">
              Pronto Radio'yu dinleyin ve<br />
              en iyi müziğin keyfini kesintisiz çıkarın.
            </h1>

            <div className="flex items-center gap-2 bg-white rounded-lg p-1 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Türe veya ülkere göre istasyon arayın"
                  className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                />
              </div>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M8 3v18m4-12v12m4-16v16m4-10v10M4 7v10" />
                </svg>
                İstasyon Ara
              </button>

            </div>

            <div className="flex justify-center space-x-2 mt-6">
              {["Pop", "R&B", "Indie", "Metal", "Country", "Rock", "Hits", "Dance"].map((genre) => (
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
              <div className="w-[15%]">
                <nav>
                  <h3 className="font-mono text-sm text-gray-600 mb-2">
                    Browse by...
                  </h3>
                  <ul className="space-y-0.5">
                    <li>
                      <Link
                        to="/genres"
                        className={
                          matches[1]?.pathname == "/genres"
                            ? selectedClassNames
                            : unSelectedClassNames
                        }
                      >
                        Genre
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/countries"
                        className={
                          matches[1]?.pathname == "/countries"
                            ? selectedClassNames
                            : unSelectedClassNames
                        }
                      >
                        Country
                      </Link>
                    </li>
                  </ul>
                </nav>
                <hr className="my-4 border-gray-300" />
                <h3 className="font-mono text-sm text-gray-600 mb-2">
                  Search for stations
                </h3>
                <form className="mt-4">
                  <div className="flex flex-col space-y-2">
                    <input
                      type="text"
                      placeholder="Station name..."
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      Search
                    </button>
                  </div>
                </form>
                <hr className="my-4 border-gray-300" />
                <p className="text-sm text-gray-600 mb-4">
                  Pronto! is your global radio companion, bringing you diverse
                  stations from around the world. Discover new music, explore
                  different cultures, and enjoy your favorite genres, all in one
                  place.
                </p>
                <a
                  href="https://github.com/gokceno/pronto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  Available on GitHub
                </a>
              </div>
              {children}
            </div>
          </div>
        </PlayerProvider>
        <Scripts />
        <script defer data-domain="radiopronto.net" src="https://plausible.io/js/script.js"></script>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
