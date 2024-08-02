import { useState, useEffect } from "react";

export default function Index() {
  const [stations, setStations] = useState([
    {
      id: "smooth-jazz-24-7",
      name: "Smooth Jazz 24/7",
      genre: "Jazz",
      language: "English",
      upvotes: 2300,
      favorites: 850,
    },
    {
      id: "k-pop-hits",
      name: "K-Pop Hits",
      genre: "Pop",
      language: "Korean",
      upvotes: 5100,
      favorites: 2700,
    },
    {
      id: "classic-rock-legends",
      name: "Classic Rock Legends",
      genre: "Rock",
      language: "English",
      upvotes: 4700,
      favorites: 2100,
    },
    {
      id: "salsa-caliente",
      name: "Salsa Caliente",
      genre: "Salsa",
      language: "Spanish",
      upvotes: 3800,
      favorites: 1900,
    },
    {
      id: "bollywood-beats",
      name: "Bollywood Beats",
      genre: "Bollywood",
      language: "Hindi",
      upvotes: 4200,
      favorites: 2300,
    },
  ]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const sortedStations = [...stations].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else {
        return b[sortBy] - a[sortBy];
      }
    });
    setStations(sortedStations);
  }, [sortBy]);

  const handlePlay = (stationId) => {
    setCurrentlyPlaying(currentlyPlaying === stationId ? null : stationId);
  };

  const handleUpvote = (stationId) => {
    setStations(
      stations.map((station) =>
        station.id === stationId
          ? { ...station, upvotes: station.upvotes + 1 }
          : station,
      ),
    );
  };

  const handleFavorite = (stationId) => {
    setStations(
      stations.map((station) =>
        station.id === stationId
          ? { ...station, favorites: station.favorites + 1 }
          : station,
      ),
    );
  };

  return (
    <div className="w-[65%] ml-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Featured Radio Stations</h2>
        <div className="text-sm">
          Sort by:
          <button
            onClick={() => setSortBy("name")}
            className="sort-link text-blue-600 hover:text-blue-800 ml-2"
          >
            Name
          </button>{" "}
          |
          <button
            onClick={() => setSortBy("upvotes")}
            className="sort-link text-blue-600 hover:text-blue-800 ml-2"
          >
            Upvotes
          </button>{" "}
          |
          <button
            onClick={() => setSortBy("favorites")}
            className="sort-link text-blue-600 hover:text-blue-800 ml-2"
          >
            Favorites
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map((station) => (
          <div
            key={station.id}
            className={`bg-white rounded-lg shadow-md p-4 ${
              currentlyPlaying === station.id ? "animate-pulse" : ""
            }`}
          >
            <button
              onClick={() => handlePlay(station.id)}
              className="play-btn bg-blue-500 text-white rounded-full p-2 mb-2 hover:bg-blue-600 transition duration-300"
            >
              {currentlyPlaying === station.id ? (
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
            <h3 className="font-bold text-lg mb-1">{station.name}</h3>
            <p className="text-sm text-gray-600 mb-1">Genre: {station.genre}</p>
            <p className="text-sm text-gray-600 mb-2">
              Language: {station.language}
            </p>
            <div className="flex justify-between text-sm text-gray-500">
              <button
                onClick={() => handleUpvote(station.id)}
                className="upvote-btn flex items-center space-x-1"
              >
                <span>👍</span>
                <span className="upvote-count">{station.upvotes}</span>
              </button>
              <button
                onClick={() => handleFavorite(station.id)}
                className="favorite-btn flex items-center space-x-1"
              >
                <span>❤️</span>
                <span className="favorite-count">{station.favorites}</span>
              </button>
            </div>
            {currentlyPlaying === station.id && (
              <div className="now-playing">
                <p className="text-sm text-green-500 font-semibold mt-2">
                  Now Playing
                </p>
                <div className="w-full h-1 bg-green-500 mt-1 animate-pulse"></div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <nav className="inline-flex" id="pagination"></nav>
      </div>
    </div>
  );
}
