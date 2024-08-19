import { createContext, useContext, useState } from "react";

const PlayerContext = createContext();

// eslint-disable-next-line react/prop-types
export function PlayerProvider({ children }) {
  const [player, setPlayer] = useState({});
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
