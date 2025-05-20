import React from 'react';
import { RemoveAllFavorites } from '../components/pop-ups/remove-all-favs-menu';

export default function DemoRemoveAllFavsMenu() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#000' }}>
      <div className="flex flex-col gap-8 items-center">
        <RemoveAllFavorites type="genre" />
        <RemoveAllFavorites type="list" />
        <RemoveAllFavorites type="station" />
      </div>
    </div>
  );
}
