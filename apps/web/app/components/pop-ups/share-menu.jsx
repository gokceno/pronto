import { Cross1Icon, EnvelopeClosedIcon, CopyIcon,  } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export const ShareMenu = ({radioName = "defaultStationName"}) => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col w-[25.6875rem] h-[15.5rem] rounded-xl justify-between bg-white'>
    
        <div className='flex flex-col'>
          <div className='w-full h-[5rem] gap-4 p-6 flex flex-row items-center justify-between'>
            <span className="font-jakarta font-semibold text-[#00192C] text-[1.25rem]/[1.75rem]">
              {t('shareStation')}
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
            <div className='w-full h-full flex flex-col gap-4 justify-between'>

                <span className='font-jakarta font-semibold text-[1rem]/[1.5rem] text-[#02141C]'>
                    {radioName}
                </span>

                <div className='w-full flex flex-col h-full rounded-lg gap-2 justify-center pl-2'>
                    <div className='gap-4 w-full h-8 flex flex-row'>
                        <div className='h-full w-[10.84375rem] hover:bg-[#E8F2FF] transition-all rounded-xl p-2 gap-6 items-center justify-center'>
                            <div className='gap-2 h-full w-full flex flex-row items-center'>
                                <CopyIcon className='w-5 h-5 text-[#00192C]'/>
                                <span className='font-jakarta font-medium text-[0.875rem]/[1.347rem] text-[#00192C]'>
                                {t('copyLink')}
                                </span>
                            </div>
                        </div>

                        <div className='h-full w-[10.84375rem] hover:bg-[#E8F2FF] transition-all rounded-xl p-2 gap-6 items-center justify-center'>
                            <div className='gap-2 h-full w-full flex flex-row items-center'>
                                <EnvelopeClosedIcon className='w-5 h-5 text-[#00192C]'/>
                                <span className='font-jakarta font-medium text-[0.875rem]/[1.347rem] text-[#00192C]'>
                                {t('mail')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='gap-4 w-full h-8 flex flex-row'>
                        <div className='h-full w-[10.84375rem] hover:bg-[#E8F2FF] transition-all rounded-xl p-2 gap-6 items-center justify-center'>
                            <div className='gap-2 h-full w-full flex flex-row items-center'>
                                <img src="/assets/twitter.svg" alt="Twitter" className="w-6 h-6" />
                                <span className='font-jakarta font-medium text-[0.875rem]/[1.347rem] text-[#00192C]'>
                                    X
                                </span>
                            </div>
                        </div>

                        <div className='h-full w-[10.84375rem] hover:bg-[#E8F2FF] transition-all rounded-xl p-2 gap-6 items-center justify-center'>
                            <div className='gap-2 h-full w-full flex flex-row items-center'>
                                <img src="/assets/wp.svg" alt="wp" className="w-6 h-6" />
                                <span className='font-jakarta font-medium text-[0.875rem]/[1.347rem] text-[#00192C]'>
                                    WhatsApp
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
  );
};
