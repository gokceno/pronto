import { useState } from 'react';
import { RemoveStationMenu } from '../components/pop-ups/remove-station-menu';

export default function DenemeRoute() {
  const [showRemoveStationMenu, setShowRemoveStationMenu] = useState(true);
  
  const handleRemove = () => {
    console.log('Station removed');
    setShowRemoveStationMenu(false);
  };
  
  const handleCancel = () => {
    setShowRemoveStationMenu(false);
  };
  
  return (
    <div className="flex w-full min-h-screen bg-black">
        <div className="">
          <RemoveStationMenu/>
        </div>
    </div>
  );
}
