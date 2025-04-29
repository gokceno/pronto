import Truncate from "../components/truncate.jsx";
import { useTranslation } from "react-i18next";
import { formatStationName } from "../utils/helpers";
import { usePlayer } from "../contexts/player.jsx";
import { useState, useEffect } from "react";
import { SpeakerLoudIcon, 
SpeakerModerateIcon, 
SpeakerQuietIcon, 
SpeakerOffIcon,
ChevronDownIcon,
DotsVerticalIcon,
HeartIcon, } from "@radix-ui/react-icons";
import { ChevronUp } from "lucide-react";
import ReactPlayer from "react-player/lazy";

const StickyAudioPlayer = () => {
  const { t } = useTranslation();
  const { player, setPlayer } = usePlayer();
  const [isClient, setIsClient] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [playerStatus, setPlayerStatus] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  const songName = player.songName || player.name || "Now Playing";
  
  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value) / 100);
  };
  
  const handleStop = () => {
    setPlayer({ ...player, isPlaying: false });
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleContinue = () => {
    setPlayer({ ...player, isPlaying: true });
  };

  const togglePlayback = () => {
    if (player.isPlaying) {
      handleStop();
    } else {
      handleContinue();
    }
  };

  if (!player.stationId) {
    return null;
  }

  return (
    <div
      className={`sticky-audio-player flex items-center gap-8 bg-[#09336B] 
        ${isMinimized ? 'h-[3.75rem] w-[37.5rem] bottom-0 rounded-t-2xl items-center px-4 pt-[0.75rem] pb-4 ' : 'rounded-2xl bottom-4 p-4 h-[4.75rem] max-w-[52.0625rem]'}
        fixed inset-x-0 mx-auto z-40 transition-all duration-300`}
    >
      {isClient && player.url && (
        <div className="absolute w-0 h-0 overflow-hidden">
          <ReactPlayer
            width={1}
            height={1}
            url={player.url}
            playing={player.isPlaying}
            volume={volume}
            onPlay={() => setPlayerStatus(`Playing: ${player.name} • ${player.country || ""}`)}
          />
        </div>
      )}
      
      {isMinimized ? (
        <div className="flex items-center pt-2.5 justify-between ">
          <div className="flex justify-between items-center gap-4">
            <button 
              className="relative flex gap-0.5 justify-between w-10 h-10 items-end"
              onClick={togglePlayback}
            >
              <div className={`absolute mb-2 ml-1 flex gap-0.5 items-end ${player.isPlaying ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                <span className="w-[0.3rem] h-5 bg-[#e6e953] rounded-t-md origin-bottom animate-[bounce_1.3s_ease_infinite_alternate_-1.2s]" />
                <span className="w-[0.3rem] h-5 bg-[#e6e953] rounded-t-md origin-bottom animate-[bounce_1.3s_ease_infinite_alternate_-2.2s]" />
                <span className="w-[0.3rem] h-5 bg-[#e6e953] rounded-t-md origin-bottom animate-[bounce_1.3s_ease_infinite_alternate_-3.7s]" />
                <span className="w-[0.3rem] h-5 bg-[#e6e953] rounded-t-md origin-bottom animate-[bounce_1.3s_ease_infinite_alternate_-0.8s]" />
              </div>
              <div className={`absolute -ml-2 inset-0 flex items-center justify-center ${player.isPlaying ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                <img src="/assets/icons/paused-bar.svg" alt="Play" className="w-8 h-8" />
              </div>
            </button>
            <div className="w-[21rem] -ml-4 overflow-hidden whitespace-nowrap">
              <div className="inline-block animate-[marquee_5s_linear_infinite] text-base text-white">
                {songName}
              </div>
            </div>
            <div className="flex -ml-2 items-center">
                {volume === 0 ? (
                  <SpeakerOffIcon className="text-white w-5 h-5" />
                ) : volume < 0.35 ? (
                  <SpeakerQuietIcon className="text-white w-5 h-5" />
                ) : volume < 0.65 ? (
                  <SpeakerModerateIcon className="text-white w-5 h-5" />
                ) : (
                  <SpeakerLoudIcon className="text-white w-5 h-5" />
                )}
                <input
                  type="range"
                  defaultValue="30"
                  onChange={handleVolumeChange}
                  className="mx-2 w-[6.25rem] h-2 bg-gray-700 rounded-full cursor-pointer accent-white transition-opacity duration-200"
                />
              </div>
          </div>
          
          <button 
            className="w-6 h-6 ml-5 flex items-center justify-center bg-[#ffffff29] hover:bg-[#167AFE] rounded-full"
            onClick={toggleMinimize}
          >
            <ChevronUp className="text-white w-4 h-4"/>
          </button>
        </div>
      ) : (
        <>
          <div className="gap-6">
            <div className="flex items-center gap-2">
              <div className="w-12 h-10 flex items-center">
                <button 
                  className="relative flex gap-0.5 justify-between w-10 h-10 items-end"
                  onClick={togglePlayback}
                >
                  <div className={`absolute inset-0 flex gap-0.5 justify-between items-end ${player.isPlaying ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    <span className="w-[0.375rem] h-8 bg-[#e6e953] rounded-t-md origin-bottom animate-[bounce_1.3s_ease_infinite_alternate_-1.2s]" />
                    <span className="w-[0.375rem] h-8 bg-[#e6e953] rounded-t-md origin-bottom animate-[bounce_1.3s_ease_infinite_alternate_-2.2s]" />
                    <span className="w-[0.375rem] h-8 bg-[#e6e953] rounded-t-md origin-bottom animate-[bounce_1.3s_ease_infinite_alternate_-3.7s]" />
                    <span className="w-[0.375rem] h-8 bg-[#e6e953] rounded-t-md origin-bottom animate-[bounce_1.3s_ease_infinite_alternate_-0.8s]" />
                  </div>
                  <div className={`absolute inset-0 flex items-center justify-center ${player.isPlaying ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                    <img src="/assets/icons/paused-bar.svg" alt="Play" className="w-10 h-10" />
                  </div>
                </button>
              </div>
              <div className="w-[12.25rem] overflow-hidden whitespace-nowrap">
                <div className="inline-block animate-[marquee_5s_linear_infinite] text-base text-white">
                  {songName}
                </div>
              </div>
              <div className="flex items-center ml-4">
                {volume === 0 ? (
                  <SpeakerOffIcon className="mr-2 text-white w-6 h-6" />
                ) : volume < 0.35 ? (
                  <SpeakerQuietIcon className="mr-2 text-white w-6 h-6" />
                ) : volume < 0.65 ? (
                  <SpeakerModerateIcon className="mr-2 text-white w-6 h-6" />
                ) : (
                  <SpeakerLoudIcon className="mr-2 text-white w-6 h-6" />
                )}
                <input
                  type="range"
                  defaultValue="30"
                  onChange={handleVolumeChange}
                  className="mx-2 w-[6.25rem] h-2 bg-gray-700 rounded-full cursor-pointer accent-white transition-opacity duration-200"
                />
              </div>
            </div>
          </div>

          <div className="flex w-[24.875rem] items-center">
            <div className="w-16 h-16 rounded-xl flex items-center">
              {player.imgSrc ? (
                <img
                  className="w-full h-full rounded-xl object-contain"
                  src={player.imgSrc}
                />
              ) : (
                <div
                  className={`flex items-center flex-shrink-0 h-11 w-16 bg-gradient-to-tr from-[#5539B2] to-[#D4C7FD] rounded-xl justify-center text-white text-base font-semibold select-none capitalize`}
                >
                  {formatStationName(player.name || "")}
                </div>
              )}
            </div>
            <div className="flex items-center w-full justify-between">
              <div className={`flex flex-col pr-4 pl-3`}>
                <div className={`text-base font-semibold text-white`}>
                  <Truncate maxLength={15}>{player.name || ""}</Truncate>
                </div>
                <div className={`text-xs text-[#ffffffcc]`}>
                  {player.clickcount || 0} {t("listeningCount")} • {player.votes || 0} {t("likes")}
                </div>
              </div>

              <div className={`flex items-center gap-4 `}>
                <button
                  className={`text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer group`}
                >
                  {/* Like button */}
                  <HeartIcon className="text-white w-5 h-5 transition-transform duration-200 ease-in-out group-hover:scale-110 group-hover:text-yellow-300" alt="Like Button" />
                </button>

                <button
                  className={`text-gray-400 hover:text-gray-500 focus:outline-none group`}
                >
                  {/* Context_menu button */}
                  <DotsVerticalIcon className="text-white w-5 h-5 transition-transform duration-200 ease-in-out group-hover:scale-110 group-hover:text-yellow-300" alt="Context Menu" />
                </button>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button 
                  className="w-10 h-10 flex items-center justify-center bg-[#ffffff29] hover:bg-[#167AFE] rounded-full"
                  onClick={toggleMinimize}
                >
                  <ChevronDownIcon className="text-white"/>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StickyAudioPlayer;