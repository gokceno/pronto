import { useState } from 'react';
import { AddToListMenu } from '../components/pop-ups/add-to-list-menu';

export default function DenemeRoute() {
  const [showAddToListMenu, setShowAddToListMenu] = useState(true);
  
  const handleAdd = () => {
    console.log('Station added to list');
    setShowAddToListMenu(false);
  };
  
  const handleCancel = () => {
    setShowAddToListMenu(false);
  };
  
  return (
    <div className="flex w-full min-h-screen bg-black">
        <div className="">
          <AddToListMenu/>
        </div>
    </div>
  );
}
