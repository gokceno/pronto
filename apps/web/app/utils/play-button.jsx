import { usePlayer } from "../contexts/player.jsx";

const PlayButton = ({
  stationId,
  name,
  url,
  country,
  clickcount,
  votes,
  type = "normal",
  className = ""
}) => {
  const { player, setPlayer } = usePlayer();
  
  const isCurrentlyPlaying = player.stationId === stationId && player.isPlaying;
  
  const handlePlayClick = () => {
    if (isCurrentlyPlaying) {
      // Just toggle the playing state
      setPlayer((prevPlayer) => ({ ...prevPlayer, isPlaying: false }));
    } else if (player.stationId === stationId) {
      // Resume playing the same station
      setPlayer((prevPlayer) => ({ ...prevPlayer, isPlaying: true }));
    } else {
      setPlayer({
        stationId,
        name,
        url,
        isPlaying: true,
        songName: name,
        country,
        clickcount,
        votes,
      });
    }
  };

  const getIconPath = () => {
    if (type === "banner") {
      return isCurrentlyPlaying 
        ? "/assets/stop-banner.svg" 
        : "/assets/play-banner.svg";
    } else {
      return isCurrentlyPlaying 
        ? "/assets/icons/stop_button.svg" 
        : "/assets/icons/play_button.svg";
    }
  };
  
  return (
    <button
      onClick={handlePlayClick}
      className={`flex items-center ${isCurrentlyPlaying ? "animate-pulse" : ""} hover:scale-105 transition-all focus:outline-none cursor-pointer ${className}`}
    >
      <img 
        src={getIconPath()} 
        alt={isCurrentlyPlaying ? "Stop" : "Play"} 
        className="w-12 h-12"
      />
    </button>
  );
};

export default PlayButton;