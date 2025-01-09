import Truncate from "../components/truncate.jsx";
import { useTranslation } from "react-i18next";
import { formatStationName } from "../utils/helpers";
import "../style.css";

const StickyAudioPlayer = ({ songName, name, clickcount, votes, imgSrc }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`sticky-audio-player flex items-center justify-evenly gap-8  bg-[#00192C] p-2 rounded-2xl w-full max-w-[920px] fixed inset-x-0 bottom-4 mx-auto z-40`}
    >
      <div className="flex items-center">
        <div className="w-20 h-10 flex item center">
          <button className="icon relative flex gap-0.5 justify-space-between w-[40px] h-[40px] items-end">
            <span className="bar animate-bounce origin-bottom animate-custom	" />
            <span className="bar animate-bounce origin-bottom animate-custom	" />
            <span className="bar animate-bounce origin-bottom animate-custom	" />
            <span className="bar animate-bounce origin-bottom animate-custom	" />
          </button>
          {/* <img
            src="/assets/icons/paused-bar.svg"
            alt="Radio Pronto"
            className="w-full mr-2"
          /> */}
        </div>
        <div className="w-full overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee text-base text-white">
            {/* Eric Chen - Praise Of Love */}
            {songName}
          </div>
        </div>
        <div className="flex items-center ml-4">
          <img
            src="/assets/icons/audi_volume.svg"
            alt="Radio Pronto"
            className="mr-2"
          />
          <input
            type="range"
            defaultValue="30"
            className="custom-range mx-2 custom-range w-[100px] h-2 bg-gray-700 rounded-full  cursor-pointer accent-white	"
          />
        </div>
      </div>

      <div className="flex items-center">
        <div className="w-16 h-16 rounded-xl flex items-center">
          {imgSrc ? (
            <img
              className="w-full h-full rounded-xl object-contain"
              src={imgSrc}
            />
          ) : (
            <div
              className={`flex items-center flex-shrink-0 h-11 w-16 bg-gradient-to-tr from-[#5539B2] to-[#D4C7FD] rounded-xl flex items-center justify-center text-white text-base font-semibold select-none capitalize	`}
            >
              {formatStationName(name)}
            </div>
          )}
        </div>
        <div className="flex items-center w-full justify-between">
          <div className={`flex flex-col pr-4 pl-3`}>
            <div className={`text-base font-semibold text-white`}>
              <Truncate>{name}</Truncate>
            </div>
            <div className={`text-xs text-[#ffffffcc]`}>
              {clickcount} {t("listeningCount")} • {votes} {t("likes")}
            </div>
          </div>

          <div className={`flex items-center gap-4 `}>
            <button
              className={`text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer`}
            >
              {/* Like button */}
              <img src="/assets/icons/like_button.svg" alt="Like Button" />
            </button>

            <button
              className={`text-gray-400 hover:text-gray-500 focus:outline-none`}
            >
              {/* Context_menu button */}
              <img src="/assets/icons/context_button.svg" alt="Context Menu" />
            </button>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button className="w-10 h-10 flex items-center justify-center bg-[#ffffff29] hover:bg-[#167AFE] rounded-full">
              <img src="/assets/icons/chevron_left.svg" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-[#ffffff29] hover:bg-[#167AFE] rounded-full">
              <img src="/assets/icons/chevron_right.svg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyAudioPlayer;
