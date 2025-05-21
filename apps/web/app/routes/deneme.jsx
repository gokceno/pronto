import React from 'react';
import StationCardContextMenu from '../components/pop-ups/station-card-context-menu';

export default function DemoStationCardContextMenu() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#000' }}>
      <StationCardContextMenu
        locale="en"
        stationuuid="demo-station-uuid"
        onClose={() => {}}
        onShare={() => {}}
        onAddToList={() => {}}
      />
    </div>
  );
}
