import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeartIcon, Share1Icon, EyeOpenIcon} from '@radix-ui/react-icons';
import { Link } from '@remix-run/react';
import { generateLocalizedRoute } from '../../utils/generate-route';

const StationCardContextMenu = ({locale, onClose, onShare}) => {
    const { t } = useTranslation();

  return (
    <div className="w-[14.0625rem] h-[15rem] flex p-4 gap-3 bg-white flex-col shadow-lg rounded-xl">
      
      <button className='flex flex-col w-full h-8 py-1 px-2 gap-2 hover:bg-[#E8F2FF] hover:rounded-lg transition-all'>
        <div className='w-full h-6 gap-1 flex flex-row items-center'>
          <img
            src="/assets/equalizer.svg"
            alt="equalizer"
            className="w-6 h-6 invert"
          />
          <Link to={generateLocalizedRoute(locale, "/genres")}>
            <span className="font-jakarta ml-1 font-medium text-[#00192C] text-[0.875rem]/[1.375rem]">
              {t('aboutStation')}
            </span>
          </Link>
        </div>
      </button>

      <div className='flex flex-col w-full gap-2'>
        <div className="w-[12.0625rem] h-[0.0625rem] bg-gray-200"/>
        <button className='flex flex-col w-full h-8 py-1 px-2 hover:bg-[#E8F2FF] hover:rounded-lg transition-all'>
          <div className='w-full h-6 gap-1 flex flex-row items-center'>
            <img
              src="/assets/music_list.svg"
              alt="music list"
              className="w-6 h-6"
            />
            <Link to={generateLocalizedRoute(locale, "/radio-lists")}>
              <span className="font-jakarta ml-1 font-medium text-[#00192C] text-[0.875rem]/[1.375rem]">
                {t('myRadioLists')}
              </span>
            </Link>
          </div>
        </button>
        <button className='flex flex-col w-full h-8 py-1 px-2 hover:bg-[#E8F2FF] hover:rounded-lg transition-all'>
          <div className='w-full h-6 gap-1 flex flex-row items-center'>
            <HeartIcon className='w-6 h-6 text-black'/>
            <span className="font-jakarta ml-1 font-medium text-[#00192C] text-[0.875rem]/[1.375rem]">
              {t('myFavs')}
            </span>
          </div>
        </button>
        <button
          className='flex flex-col w-full h-8 py-1 px-2 hover:bg-[#E8F2FF] hover:rounded-lg transition-all'
          onClick={onClose}
        >
          <div className='w-full h-6 gap-1 flex flex-row items-center'>
            <EyeOpenIcon className='w-6 h-6 text-black'/>
            <span className="font-jakarta ml-1 font-medium text-[#00192C] text-[0.875rem]/[1.375rem]">
              {t('showLess')}
            </span>
          </div>
        </button>
        <div className="w-[12.0625rem] h-[0.0625rem] bg-gray-200"/>
      </div>

      <button
        className='flex flex-col w-full h-8 py-1 px-2 gap-2 hover:bg-[#E8F2FF] hover:rounded-lg transition-all'
        onClick={onShare}
      >
        <div className='w-full h-6  gap-1 flex flex-row items-center'>
          <Share1Icon className='w-6 h-6 text-[#00192C]'/>
          <span className="font-jakarta ml-1 font-medium text-[#00192C] text-[0.875rem]/[1.375rem]">
            {t('share')}
          </span>
        </div>
      </button>
    </div>
  );
};

export default StationCardContextMenu;