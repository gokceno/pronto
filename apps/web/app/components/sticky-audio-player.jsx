import Truncate from "../components/truncate.jsx";
import { useTranslation } from "react-i18next";
import { formatStationName } from "../utils/helpers";
import { usePlayer } from "../contexts/player.jsx";
import { useState, useEffect, useRef } from "react";
import { SpeakerLoudIcon, 
SpeakerModerateIcon, 
SpeakerQuietIcon, 
SpeakerOffIcon,
DotsVerticalIcon,
HeartIcon,
ChevronLeftIcon,
ChevronRightIcon
 } from "@radix-ui/react-icons";
import ReactPlayer from "react-player/lazy";
import { formatNumber } from "../utils/format-number.js";
import StationCardContextMenu from "./pop-ups/station-card-context-menu";
import ShareMenu from "./pop-ups/share-menu";

const StickyAudioPlayer = () => {
  const { t } = useTranslation();
  const { player, setPlayer } = usePlayer();
  const [isClient, setIsClient] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [prevVolume, setPrevVolume] = useState(0.3);
  const [playerStatus, setPlayerStatus] = useState("");
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setContextMenuOpen(false);
        setShareMenuOpen(false);
      }
    };
    if (contextMenuOpen || shareMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenuOpen, shareMenuOpen]);

  const songName = player.songName || player.name || "Now Playing";
  
  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value) / 100);
    if (parseFloat(e.target.value) / 100 > 0) {
      setPrevVolume(parseFloat(e.target.value) / 100);
    }
  };
  
  const toggleMute = () => {
    if (volume === 0) {
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      setVolume(0);
    }
  };
  
  const handleStop = () => {
    setPlayer({ ...player, isPlaying: false });
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

  // New functions for station navigation
  const goToNextStation = () => {
    if (!player.stationList || player.stationList.length === 0) return;
    
    const currentIndex = player.currentStationIndex;
    const nextIndex = currentIndex >= player.stationList.length - 1 ? 0 : currentIndex + 1;
    const nextStation = player.stationList[nextIndex];
    
    if (nextStation) {
      setPlayer({
        ...player,
        stationId: nextStation.id,
        name: nextStation.name,
        url: nextStation.url,
        isPlaying: true,
        songName: nextStation.name,
        country: nextStation.country,
        clickcount: nextStation.clickCount,
        votes: nextStation.votes,
        currentStationIndex: nextIndex
      });
    }
  };
  
  const goToPreviousStation = () => {
    if (!player.stationList || player.stationList.length === 0) return;
    
    const currentIndex = player.currentStationIndex;
    const prevIndex = currentIndex <= 0 ? player.stationList.length - 1 : currentIndex - 1;
    const prevStation = player.stationList[prevIndex];
    
    if (prevStation) {
      setPlayer({
        ...player,
        stationId: prevStation.id,
        name: prevStation.name,
        url: prevStation.url,
        isPlaying: true,
        songName: prevStation.name,
        country: prevStation.country,
        clickcount: prevStation.clickCount,
        votes: prevStation.votes,
        currentStationIndex: prevIndex
      });
    }
  };

  if (!player.stationId) {
    return null;
  }

  return (
    <div
      className="sticky-audio-player flex items-center gap-8 bg-[#09336B] 
        rounded-2xl bottom-4 p-4 h-[4.75rem] max-w-[56rem]
        fixed inset-x-0 mx-auto z-40 transition-all duration-300"
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
      
      <>
        <div className="gap-6">
          <div className="flex items-center gap-2">
            <div className="w-12 h-10 flex items-center">
              <button 
                className="relative flex gap-0.5 justify-between w-10 h-10 items-end"
                onClick={togglePlayback}
              >
                <div className={`absolute inset-0 flex gap-0.5 justify-center items-center ${player.isPlaying ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                  <img src="/assets/stop-bar.svg" alt="Stop" className="w-10 h-10" />
                </div>
                <div className={`absolute inset-0 flex items-center justify-center ${player.isPlaying ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                  <img src="/assets/play-bar.svg" alt="Play" className="w-10 h-10" />
                </div>
              </button>
            </div>
            <div className="w-[12.25rem] overflow-hidden whitespace-nowrap">
              <div className="inline-block animate-[marquee_5s_linear_infinite] text-base text-white">
                {songName}
              </div>
            </div>
            <div className="flex items-center ml-4">
              <div onClick={toggleMute} className="cursor-pointer">
                  {volume === 0 ? (
                    <SpeakerOffIcon className="text-white w-6 h-6" />
                  ) : volume < 0.35 ? (
                    <SpeakerQuietIcon className=" text-white w-6 h-6" />
                  ) : volume < 0.65 ? (
                    <SpeakerModerateIcon className=" text-white w-6 h-6" />
                  ) : (
                    <SpeakerLoudIcon className=" text-white w-6 h-6" />
                  )}
                </div>
              <div className="relative mx-2 w-[4.3125rem] h-2 group">
                <div className="absolute inset-0 bg-white/15 rounded-full"></div>
                <div 
                  className="absolute inset-y-0 left-0 bg-white rounded-full" 
                  style={{ width: `${volume * 100}%` }}
                ></div>
                <input
                  type="range"
                  value={volume * 100}
                  onChange={handleVolumeChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="absolute top-1/2 -translate-y-1/2 rounded-full w-3 h-3 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{ left: `calc(${volume * 100}% - 0.375rem)` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-[24.875rem] gap-4 -ml-2 items-center">
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
                {formatNumber(player.locale, player.clickcount)} {t("listeningCount")} • {formatNumber(player.locale, player.votes)} {t("likes")}
              </div>
            </div>

            <div className={`flex items-center gap-4 `}>
              <button
                className={`text-gray-400 hover:text-gray-500 focus:outline-none group`}
              >
                {/* Like button */}
                <HeartIcon className="text-white w-5 h-5 transition-transform duration-200 ease-in-out group-hover:scale-110 group-hover:text-yellow-300" alt="Like Button" />
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  className={`text-gray-400 hover:text-gray-500 focus:outline-none group`}
                  onClick={() => setContextMenuOpen((prev) => !prev)}
                >
                  {/* Context_menu button */}
                  <DotsVerticalIcon className="text-white w-5 h-5 transition-transform duration-200 ease-in-out group-hover:scale-110 group-hover:text-yellow-300" alt="Context Menu" />
                </button>
                {contextMenuOpen && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 bottom-12 z-50 transition-opacity duration-300"
                  >
                    <StationCardContextMenu
                      locale={player.locale || "en"}
                      onClose={() => setContextMenuOpen(false)}
                      onShare={() => {
                        setContextMenuOpen(false);
                        setShareMenuOpen(true);
                      }}
                      stationuuid={player.stationId}
                      fav={false}
                      list={false}
                    />
                  </div>
                )}
                {shareMenuOpen && (
                  <>
                    <div className="fixed inset-0 overflow-hidden" />
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                      <ShareMenu
                        open={true}
                        type={"station"}
                        locale={player.locale || "en"}
                        onClose={() => setShareMenuOpen(false)}
                        name={player.name}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex -mr-14 flex-row gap-2">
            <button
              onClick={goToPreviousStation}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#E6E953] bg-white/15 transition-all hover:scale-110 duration-200 group"
              aria-label="Previous Station"
            >
              <ChevronLeftIcon className="text-[#8C9195] w-6 h-6 ease-in-out group-hover:text-[#09336B]" alt="Previous" />
            </button>
            <button
              onClick={goToNextStation}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#E6E953] bg-white/15 transition-all hover:scale-110 duration-200 group"
              aria-label="Next Station"
            >
              <ChevronRightIcon className="text-[#8C9195] w-6 h-6 ease-in-out group-hover:text-[#09336B]" alt="Next" />
            </button>
          </div>

        </div>
      </>
    </div>
  );
};

export default StickyAudioPlayer;