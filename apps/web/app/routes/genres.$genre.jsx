import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import Truncate from "../components/truncate.jsx";
import Pagination from "../components/pagination.jsx";
import SortController from "../components/sort.jsx";

export const meta = () => [{ title: "Radio Stations in Pop • Radio Pronto!" }];

export const loader = async ({ params, request }) => {
  const { genre } = params;
  const page = new URL(request.url)?.searchParams?.get("p") || 0;
  const sort = new URL(request.url)?.searchParams?.get("s") || "name";
  // eslint-disable-next-line no-undef
  const recordsPerPage = process.env.NUM_OF_RADIOS_PER_PAGE || 21;
  const response = await fetch(
    // eslint-disable-next-line no-undef
    `${process.env.RB_API_BASE_URL}/json/stations/bytag/${genre}?limit=${recordsPerPage}&offset=${
      (page - 1) * 20
    }&reverse=${["clickcount", "votes"].includes(sort)}&order=${sort}`,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "User-Agent": process.env.APP_USER_AGENT || "",
      },
    },
  );
  return json({
    stations: await response.json(),
    genreCode: genre,
    recordsPerPage,
  });
};

export default function Index() {
  const { stations, genreCode, recordsPerPage } = useLoaderData();
  const { genres } = useRouteLoaderData("routes/genres");
  const [{ name: genreName, stationcount: genreStationCount }] = genres.filter(
    (g) => g.name === genreCode,
  );
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  const handlePlay = (stationId) => {
    setCurrentlyPlaying(currentlyPlaying === stationId ? null : stationId);
  };

  return (
    <div className="w-[65%] ml-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold capitalize">
          Radio Stations in {genreName} &bull; {genreStationCount}
        </h2>
        <SortController />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map(
          ({ stationuuid, name, tags, clickcount, votes, language }) => (
            <div
              key={stationuuid}
              className={`bg-white rounded-lg shadow-md p-4 ${
                currentlyPlaying === stationuuid ? "animate-pulse" : ""
              }`}
            >
              <button
                onClick={() => handlePlay(stationuuid)}
                className="play-btn bg-blue-500 text-white rounded-full p-2 mb-2 hover:bg-blue-600 transition duration-300"
              >
                {currentlyPlaying === stationuuid ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 stop-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 play-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </button>
              <h3 className="font-bold text-lg mb-1" title={name}>
                <Truncate>{name}</Truncate>
              </h3>
              <p className="text-sm text-gray-600 mb-1 capitalize">
                Genre: {tags}
              </p>
              <p className="text-sm text-gray-600 mb-2 capitalize">
                Language: {language}
              </p>
              <div className="flex justify-between text-sm text-gray-500">
                <button className="upvote-btn flex items-center space-x-1">
                  <span>👍</span>
                  <span className="upvote-count">{votes}</span>
                </button>
                <button className="favorite-btn flex items-center space-x-1">
                  <span>🔊</span>
                  <span className="favorite-count">{clickcount}</span>
                </button>
              </div>
              {currentlyPlaying === stationuuid && (
                <div className="now-playing">
                  <p className="text-sm text-green-500 font-semibold mt-2">
                    Now Playing
                  </p>
                  <div className="w-full h-1 bg-green-500 mt-1 animate-pulse"></div>
                </div>
              )}
            </div>
          ),
        )}
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          totalRecords={genreStationCount}
          recordsPerPage={recordsPerPage}
        />
      </div>
    </div>
  );
}
