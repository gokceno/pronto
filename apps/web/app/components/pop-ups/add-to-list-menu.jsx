import { Cross1Icon, CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export const AddToListMenu = ({ lists = ["Default1", "Default2"] }) => {
  const { t } = useTranslation();
  const [selectedLists, setSelectedLists] = useState([]);

  const toggleListSelection = (index) => {
    setSelectedLists(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <div className='flex flex-col w-[25.6875rem] h-[21.25rem] rounded-xl justify-between bg-white'>
    
        <div className='flex flex-col'>
          <div className='w-full h-[5rem] gap-4 p-6 flex flex-row items-center justify-between'>
            <span className="font-jakarta font-semibold text-[#00192C] text-[1.25rem]/[1.75rem]">
              {t('addToRadioList')}
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
            <div className='w-full h-full flex flex-col'>
                <span className='font-jakarta font-semibold text-base text-[#02141C]'>{t('createdLists')}</span>

                <div className='w-full flex flex-col mt-4'>
                    {lists.map((list, index) => (
                        <div 
                            key={index} 
                            className='w-full h-[3.125rem] transition-all p-2 hover:rounded-lg hover:bg-[#E8F2FF] flex flex-row items-center justify-between cursor-pointer'
                            onClick={() => toggleListSelection(index)}
                        >
                            <div className='flex flex-col h-[2.125rem]'>
                                <span className='font-jakarta text-sm/[1.375rem] text-[#00192C]'>{list}</span>
                                <span className='font-jakarta text-[0.625rem]/[0.875rem] text-[#4F5457]'>{t('cardStations')}</span>
                            </div>
                            <div className='transition-opacity duration-300 ease-in-out'>
                                <CheckIcon 
                                    className={`w-6 h-6 text-[#167AFE] transition-opacity duration-300 ease-in-out ${
                                        selectedLists.includes(index) ? 'opacity-100' : 'opacity-0'
                                    }`} 
                                />
                            </div>
                        </div>
                    ))}
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

            <div className="w-[19.6875rem] h-10 flex flex-row justify-between items-center">

              <button className='px-4 transition-all hover:scale-105 rounded-[2rem] border border-gray-200 bg-white w-[13.625rem] flex flex-row h-[2.5rem] gap-1 items-center justify-center'>
                  <span className='font-jakarta font-semibold text-[0.875rem]/[1.375rem] text-[#167AFE] line-clamp-1'>
                  { t('createNewList')}
                  </span>
              </button>

              <button className='px-4 transition-all hover:scale-105 rounded-[2rem] bg-[#167AFE] w-[5.5625rem] flex flex-row h-[2.5rem] gap-1 items-center justify-center'>
                  <PlusIcon className='w-6 h-6 text-white'/>
                  <span className='font-jakarta font-semibold text-[0.875rem]/[1.375rem] text-white'>
                  { t('add')}
                  </span>
              </button>
            </div>

            
            </div>

        </div>

    </div>
  );
};
