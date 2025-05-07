import { Cross1Icon, CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export const CreateNewListMenu = ({ }) => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col w-[25.6875rem] h-[23.125rem] rounded-xl justify-between bg-white'>
    
        <div className='flex flex-col'>
          <div className='w-full h-[5rem] gap-4 p-6 flex flex-row items-center justify-between'>
            <span className="font-jakarta font-semibold text-[#00192C] text-[1.25rem]/[1.75rem]">
              {t('newList')}
            </span>

            <div className='h-8 w-8 flex rounded-full justify-end'>
              <button className="transition-all hover:scale-125 group">
                <Cross1Icon className='w-6 h-6 text-[#A1A1AA] group-hover:text-[#DB0A3C]'/>
              </button>
            </div>
          </div>
          <div className="w-full h-[0.0625rem] bg-gray-300"/>
        </div>


        <div className='w-full h-full p-6 gap-6'>
            <div className='w-full h-full flex flex-col gap-4'>
                <div className='w-full flex flex-col h-12 border border-gray-300 rounded-lg gap-2 justify-center pl-2'>
                    <span className='font-jakarta font-normal text-[0.875rem]/[1.375rem] text-[#656B6F]'>
                        {t('title')}
                    </span>
                </div>

                <div className='w-full flex flex-col h-[6.625rem] border border-gray-300 rounded-lg gap-2 pt-2 pl-2'>
                    <span className='font-jakarta font-normal text-[0.875rem]/[1.375rem] text-[#656B6F]'>
                        {t('desc')}
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
                {t('cancel')}
                </span>
                <span className='absolute -bottom-1 left-0 w-0 h-[0.1rem] bg-[#167AFE] transition-all duration-300 group-hover:w-full'></span>
            </button>

              <button className='px-4 transition-all hover:scale-105 rounded-[2rem] bg-[#167AFE] w-[8.875rem] flex flex-row h-[2.5rem] gap-1 items-center justify-center'>
                  <span className='font-jakarta font-semibold text-[0.875rem]/[1.375rem] text-white'>
                  { t('create')}
                  </span>
              </button>

            
            </div>

        </div>

    </div>
  );
};
