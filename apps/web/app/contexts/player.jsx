import { createContext, useContext, useState, useCallback } from "react";

const PlayerContext = createContext();

// eslint-disable-next-line react/prop-types
export function PlayerProvider({ children }) {
  const [player, setPlayerState] = useState({
    stationList: [], // Add stationList to store available stations
    currentStationIndex: -1, // Track current station index
  });

  const setPlayer = useCallback((newPlayerState) => {
    if (typeof newPlayerState === "function") {
      setPlayerState((prevState) => {
        const updatedState = newPlayerState(prevState);
        return updatedState;
      });
    } else {
      // If updating with a new station, try to find its index in the station list
      if (newPlayerState.stationId && newPlayerState.stationList) {
        const stationIndex = newPlayerState.stationList.findIndex(
          (station) => station.id === newPlayerState.stationId,
        );
        newPlayerState.currentStationIndex =
          stationIndex !== -1 ? stationIndex : -1;
      }
      setPlayerState(newPlayerState);
    }
  }, [player.stationId]);

  return (
    <PlayerContext.Provider value={{ player, setPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    return { player: {}, setPlayer: () => {} };
  }
  return context;
}
