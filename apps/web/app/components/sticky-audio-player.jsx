import Truncate from "../components/truncate.jsx";
import { useTranslation } from "react-i18next";
import { formatStationName } from "../utils/helpers";
import "../style.css";
import { usePlayer } from "../contexts/player.jsx";
import { useState, useEffect } from "react";
import { SpeakerLoudIcon, 
SpeakerModerateIcon, 
SpeakerQuietIcon, 
SpeakerOffIcon,
ChevronLeftIcon,
ChevronRightIcon,
DotsVerticalIcon,
HeartIcon, } from "@radix-ui/react-icons";
import ReactPlayer from "react-player/lazy";

const StickyAudioPlayer = () => {
  const { t } = useTranslation();
  const { player, setPlayer } = usePlayer();
  const [isClient, setIsClient] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [playerStatus, setPlayerStatus] = useState("");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  // Use default song name if none available from the player
  const songName = player.songName || player.name || "Now Playing";
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value) / 100);
  };
  
  // Handle stopping playback
  const handleStop = () => {
    setPlayer({ ...player, isPlaying: false });
  };

  // Handle next/previous station (just stops for now)
  const handleNavigation = () => {
    setPlayer({ ...player, isPlaying: false });
  };

  // Check if player should be visible
  if (!player.stationId) {
    return null;
  }

  return (
    <div
      className={`sticky-audio-player flex justify-between items-center gap-8 bg-[#00192C] p-4 rounded-2xl w-full max-w-[57.5rem] fixed inset-x-0 bottom-4 mx-auto z-40`}
    >
      {isClient && player.url && (
        <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
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
      
      <div className="gap-6">
        <div className="flex items-center gap-2">
          <div className="w-12 h-10 flex items-center">
            <button 
              className="icon relative flex gap-0.5 justify-space-between w-10 h-10 items-end"
              onClick={handleStop}
            >
              <span className={`bar origin-bottom ${player.isPlaying ? 'animate-bounce animate-custom' : ''}`} />
              <span className={`bar origin-bottom ${player.isPlaying ? 'animate-bounce animate-custom' : ''}`} />
              <span className={`bar origin-bottom ${player.isPlaying ? 'animate-bounce animate-custom' : ''}`} />
              <span className={`bar origin-bottom ${player.isPlaying ? 'animate-bounce animate-custom' : ''}`} />
            </button>
          </div>
          <div className="w-[12.25rem] overflow-hidden whitespace-nowrap">
            <div className="inline-block animate-marquee text-base text-white">
              {songName}
            </div>
          </div>
          <div className="flex items-center ml-4">
            {volume === 0 ? (
              <SpeakerOffIcon className="mr-2 text-white w-5 h-5" />
            ) : volume < 0.35 ? (
              <SpeakerQuietIcon className="mr-2 text-white w-5 h-5" />
            ) : volume < 0.65 ? (
              <SpeakerModerateIcon className="mr-2 text-white w-5 h-5" />
            ) : (
              <SpeakerLoudIcon className="mr-2 text-white w-5 h-5" />
            )}
            <input
              type="range"
              defaultValue="30"
              onChange={handleVolumeChange}
              className="custom-range mx-2 custom-range w-[100px] h-2 bg-gray-700 rounded-full cursor-pointer accent-white"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center">
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
              <Truncate>{player.name || ""}</Truncate>
            </div>
            <div className={`text-xs text-[#ffffffcc]`}>
              {player.clickcount || 0} {t("listeningCount")} • {player.votes || 0} {t("likes")}
            </div>
          </div>

          <div className={`flex items-center gap-4 `}>
            <button
              className={`text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer`}
            >
              {/* Like button */}
              <HeartIcon className="text-white w-5 h-5" alt="Like Button" />
            </button>

            <button
              className={`text-gray-400 hover:text-gray-500 focus:outline-none`}
            >
              {/* Context_menu button */}
              <DotsVerticalIcon className="text-white w-5 h-5" alt="Context Menu" />
            </button>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button 
              className="w-10 h-10 flex items-center justify-center bg-[#ffffff29] hover:bg-[#167AFE] rounded-full"
              onClick={handleNavigation}
            >
              <ChevronLeftIcon className="text-white"/>
            </button>
            <button 
              className="w-10 h-10 flex items-center justify-center bg-[#ffffff29] hover:bg-[#167AFE] rounded-full"
              onClick={handleStop}
            >
              <ChevronRightIcon className="text-white"/>
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyAudioPlayer;