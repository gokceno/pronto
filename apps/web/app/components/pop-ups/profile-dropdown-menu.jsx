import { PersonIcon, HeartIcon, ExitIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { generateLocalizedRoute } from '../../utils/generate-route';
import { Link } from '@remix-run/react';

export const ProfileDropdownMenu = ({ locale }) => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col w-[14.0625rem] h-[13rem] shadow-lg rounded-xl p-4 gap-3 justify-between bg-white'>
    
        <button className='flex flex-col w-full h-8 py-1 px-2 gap-2 hover:bg-[#E8F2FF] hover:rounded-lg transition-all'>
          <div className='w-full h-6  gap-1 flex flex-row items-center'>
            <PersonIcon className='w-6 h-6 text-black'/>
            <Link to={generateLocalizedRoute(locale, "/profile")}>
                <span className="font-jakarta ml-1 font-medium text-[#00192C] text-[0.875rem]/[1.375rem]">
                {t('accountSettings')}
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
            <div className="w-[12.0625rem] h-[0.0625rem] bg-gray-200"/>
        </div>

        <button className='flex flex-col w-full h-8 py-1 px-2 gap-2 hover:bg-[#E8F2FF] hover:rounded-lg transition-all'>
          <div className='w-full h-6  gap-1 flex flex-row items-center'>
            <ExitIcon className='w-6 h-6 text-[#DB0A3C]'/>
            <span className="font-jakarta ml-1 font-medium text-[#DB0A3C] text-[0.875rem]/[1.375rem]">
              {t('logout')}
            </span>
          </div>
        </button>
    </div>
  );
};
