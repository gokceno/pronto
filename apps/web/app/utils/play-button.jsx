import { usePlayer } from "../contexts/player.jsx";

const PlayButton = ({
  stationId,
  name,
  url,
  country,
  clickcount,
  votes,
  type = "normal",
  className = "",
  stationList // Add stationList property
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
      // Create a station object that matches the structure expected by the navigation functions
      const stationObj = {
        id: stationId,
        name,
        url,
        country,
        clickCount: clickcount,
        votes
      };
      
      // Find the index of this station in the stationList if available
      let currentStationIndex = -1;
      let updatedStationList = player.stationList || [];
      
      // If a stationList is passed, use it to update the player context
      if (stationList && stationList.length > 0) {
        updatedStationList = stationList;
        currentStationIndex = stationList.findIndex(station => station.id === stationId);
      } else if (updatedStationList.length > 0) {
        // Try to find the station in the existing list
        currentStationIndex = updatedStationList.findIndex(station => station.id === stationId);
        
        // If not found, add it to the list
        if (currentStationIndex === -1) {
          updatedStationList = [...updatedStationList, stationObj];
          currentStationIndex = updatedStationList.length - 1;
        }
      } else {
        // Initialize with a single station if no list exists
        updatedStationList = [stationObj];
        currentStationIndex = 0;
      }
      
      setPlayer({
        stationId,
        name,
        url,
        isPlaying: true,
        songName: name,
        country,
        clickcount,
        votes,
        stationList: updatedStationList,
        currentStationIndex
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