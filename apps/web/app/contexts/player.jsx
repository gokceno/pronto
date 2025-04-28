import { createContext, useContext, useState, useCallback } from "react";

const PlayerContext = createContext();

// eslint-disable-next-line react/prop-types
export function PlayerProvider({ children }) {
  const [player, setPlayerState] = useState({});
  
  const setPlayer = useCallback((newPlayerState) => {
    if (typeof newPlayerState === 'function') {
      setPlayerState((prevState) => {
        const updatedState = newPlayerState(prevState);
        return updatedState;
      });
    } else {
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