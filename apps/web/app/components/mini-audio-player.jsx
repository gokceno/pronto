import { useState, useEffect } from "react";
import ReactPlayer from "react-player/lazy";
import { usePlayer } from "../contexts/player.jsx";

const MiniAudioPlayer = () => {
  const [isClient, setIsClient] = useState(false);
  const [playerStatus, setPlayerStatus] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);
  const { player, setPlayer } = usePlayer();
  return (
    <div
      className={`flex items-center space-x-2 ml-auto ${
        player.stationId ? "animate-pulse" : ""
      }`}
    >
      {isClient && player.stationId && (
        <ReactPlayer
          width={1}
          height={1}
          url={player.url}
          playing={true}
          onPlay={() =>
            setPlayerStatus(`Playing: ${player.name} • ${player.country}`)
          }
        />
      )}
      {player.stationId && (
        <button
          onClick={() => setPlayer({})}
          className="text-white focus:outline-none"
        >
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
        </button>
      )}

      {player.stationId ? (
        <span className="text-sm">
          {playerStatus ? playerStatus : "Loading..."} 🔊
        </span>
      ) : (
        <span className="text-sm">
          Choose a radio station 📻 to start playing! 🔊
        </span>
      )}
    </div>
  );
};

export default MiniAudioPlayer;
