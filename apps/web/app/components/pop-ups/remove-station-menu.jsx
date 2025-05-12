import { Cross1Icon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

export const RemoveStationMenu = ({listName = "MY LIST"}) => {
  const { t } = useTranslation();

  return (
    <div 
      className="flex flex-col w-[25.6875rem] h-[26.875rem] rounded-xl justify-between bg-white"
    >
      <div className='w-full h-[1rem] gap-4 p-6 flex justify-end'>
        <div className='h-8 w-8 flex rounded-full justify-end'>
          <button className="transition-all hover:scale-125 group">
            <Cross1Icon className='w-6 h-6 text-[#A1A1AA] group-hover:text-[#DB0A3C]'/>
          </button>
        </div>
      </div>

      <div className='px-6 pb-6 gap-6 flex flex-col w-full h-[13.375rem]'>

        <div className="flex flex-col items-center justify-center gap-4">
          <img 
            src="/assets/remove-list.svg" 
            alt="Remove from list" 
            className="w-30 h-30"
          />
          <div className="w-full h-5.875rem gap-4 flex flex-col text-center">
            <span className="font-jakarta font-semibold text-xl text-[#DB0A3C]">
              {t('listDeleteHeader')}
            </span>
            <span className="font-jakarta text-sm/[1.375rem] font-normal text-[#02141C]">
              {t('listDeleteUnder', { listName })}
            </span>
          </div>
        </div>
        
      </div>

      <div className='flex flex-col'>
        
        <div className="w-full h-[0.0625rem] bg-gray-300"/>
        <div className='w-full h-[4.5rem] flex flex-row justify-between items-center px-4'>
          <button 
            className='gap-2 items-center justify-center relative group'
          >
            <span className='font-jakarta font-semibold text-sm/[1.375rem] text-[#167AFE]'>
              {t('abort')}
            </span>
            <span className='absolute -bottom-1 left-0 w-0 h-[0.1rem] bg-[#167AFE] transition-all duration-300 group-hover:w-full'></span>
          </button>

          <button className='px-4 transition-all hover:scale-105 rounded-[2rem] bg-[#DB0A3C] w-[13.625rem] h-[2.5rem] gap-1 items-center justify-center'>
            <span className='font-jakarta font-semibold text-sm/[1.375rem] text-white'>
              { t('confirmListDelete')}
            </span>
          </button>

          
        </div>

      </div>
    </div>
  );
};
