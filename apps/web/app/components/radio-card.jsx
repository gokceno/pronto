import { usePlayer } from "../contexts/player.jsx";
import Truncate from "../components/truncate.jsx";
import { formatStationName, formatStationTag } from "../utils/helpers";
import { useTranslation } from "react-i18next";

const RadioCard = ({
  stationuuid,
  name,
  tags,
  clickcount,
  votes,
  language,
  url,
  country,
}) => {
  const { player, setPlayer, setIsStickyAudioPlayerVisible } = usePlayer();
  const { t } = useTranslation();
  const genres = tags
      .slice(0, 6)
      .map((tag) => (
        <button
          key={`${stationuuid}`}
          className="h-[27px] px-2 py-1 bg-blue-100 text-blue-800 rounded-lg font-bold text-xs capitalize"
        >
          {formatStationTag(tag)}
        </button>
    ));

  return (
    <div
      className={`flex flex-col flex-wrap max-w-sm mx-auto bg-white rounded-xl border border-gray-200 overflow-hidden p-4 flex-shrink-0 justify-between gap-3 w-full`}
    >
      <div className={`flex gap-2`}>
        <div
          className={`flex items-center flex-shrink-0 h-11 w-11 bg-gradient-to-tr from-[#5539B2] to-[#D4C7FD] rounded-full flex items-center justify-center text-white text-xs font-semibold select-none capitalize	`}
        >
          {formatStationName(name)}
        </div>
        <div className={`flex flex-col`}>
          <div className={`text-base font-semibold text-gray-900`}>
            <Truncate>{name}</Truncate>
          </div>
          <div className={`text-xs text-[#00192CA3]/[0.64]`}>
            {clickcount} {t("listeningCount")} • {votes} {t("likes")}
          </div>
        </div>
      </div>

      <div className="h-[60px] ml-0.5 flex flex-wrap gap-1.5 select-none justify-start">
        {genres}
      </div>
      <div className={`flex justify-between mt-3`}>
        <div
          key={stationuuid}
          className={`flex items-center ${
            player.stationId === stationuuid ? "animate-pulse" : ""
          } `}
        >
          <button
            onClick={() => {
              setPlayer(
                stationuuid == player.stationId
                  ? {}
                  : { name, url, stationId: stationuuid, country }
              );
              setIsStickyAudioPlayerVisible(stationuuid !== player.stationId);
            }}
            className={`flex items-center text-white rounded-full hover:bg-blue-600 focus:outline-none cursor-pointer`}
          >
            {player.stationId === stationuuid ? (
              <img src="/assets/icons/stop_button.svg" alt="Play Button" />
            ) : (
              <img src="/assets/icons/play_button.svg" alt="Play Button" />
            )}
          </button>
        </div>

        <div className={`flex items-center gap-4`}>
          <button
            className={`text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer`}
          >
            <img src="/assets/icons/like_button.svg" alt="Like Button" />
          </button>

          <button
            className={`text-gray-400 hover:text-gray-500 focus:outline-none`}
          >
            <img src="/assets/icons/context_button.svg" alt="Context Menu" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RadioCard;
