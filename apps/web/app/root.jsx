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

// eslint-disable-next-line react/prop-types
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
            <h1 className="text-3xl font-bold font-mono">Pronto!</h1>
            <MiniAudioPlayer />
          </header>
          <div className="container mx-auto p-4 mt-6">
            <div className="flex">
              {/* Left column */}
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
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
