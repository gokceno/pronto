import { usePlayer } from "../contexts/player.jsx";
import { useTranslation } from 'react-i18next';
import Truncate from "../components/truncate.jsx";

const RadioCard = ({
  // eslint-disable-next-line react/prop-types
  stationuuid,
  // eslint-disable-next-line react/prop-types
  name,
  // eslint-disable-next-line react/prop-types
  tags,
  // eslint-disable-next-line react/prop-types
  clickcount,
  // eslint-disable-next-line react/prop-types
  votes,
  // eslint-disable-next-line react/prop-types
  language,
  // eslint-disable-next-line react/prop-types
  url,
  // eslint-disable-next-line react/prop-types
  country,
}) => {
  const { player, setPlayer } = usePlayer();
  return (
    <div
      key={stationuuid}
      className={`bg-white rounded-lg shadow-md p-4 ${
        player.stationId === stationuuid ? "animate-pulse" : ""
      }`}
    >
      <button
        onClick={() =>
          setPlayer(
            stationuuid == player.stationId
              ? {}
              : { name, url, stationId: stationuuid, country },
          )
        }
        className="play-btn bg-blue-500 text-white rounded-full p-2 mb-2 hover:bg-blue-600 transition duration-300"
      >
        {player.stationId === stationuuid ? (
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
      {tags && (
        <p className="text-sm text-gray-600 mb-1 capitalize">
          <Truncate>{tags.split(",").splice(0, 5).join(", ")}</Truncate>
        </p>
      )}
      {language && (
        <p className="text-sm text-gray-600 mb-2 capitalize">
          Language: {language.split(",").splice(0, 3).join(", ")} • {country}
        </p>
      )}
      <div className="flex justify-between text-sm text-gray-500">
        <span className="upvote-btn flex items-center space-x-1">
          <span>👍</span>
          <span className="upvote-count">{votes}</span>
        </span>
        <span className="favorite-btn flex items-center space-x-1">
          <span>🔊</span>
          <span className="favorite-count">{clickcount}</span>
        </span>
      </div>
    </div>
  );
};

export default RadioCard;
