import { useState, useRef, useEffect } from 'react';
import { Cross1Icon, EnvelopeClosedIcon, CopyIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

export default function ShareMenu({ radioName = "defaultStationName", onClose }) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const [exiting, setExiting] = useState(false);
    const menuRef = useRef(null); 
    const stationPath = window.location.href;

    const CopySuccess = () => (
      <div
        className={`fixed bottom-8 transform -translate-x-1/2 z-50 w-[14.875rem] h-[3.5rem] rounded-lg gap-3 p-4 bg-[#D9F4E5] flex flex-row items-center justify-between shadow-lg
          ${exiting ? 'animate-slide-down' : 'animate-slide-up'}`}
        onAnimationEnd={() => {
          if (exiting) setCopied(false);
        }}
      >
        <div className='w-[10.625rem] h-6 gap-3 flex flex-row items-center justify-center'>
          <CheckCircledIcon className='w-6 h-6 text-[#07552B]'/>
          <span className='font-jakarta font-normal text-sm/[1.375rem] text-[#07552B]'>
            {t('copySuccess')}
          </span>
        </div>
        <button onClick={() => setExiting(true)}>
          <Cross1Icon className='w-4 h-4 text-[#07552B] group-hover:scale-110'/>
        </button>
      </div>
    );

    const handleCopyLink = async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setExiting(false);
          setTimeout(() => setExiting(true), 1500);
        } catch (err) {
          setCopied(false);
        }
    };

    // Add this useEffect to handle outside clicks
    useEffect(() => {
      function handleClickOutside(event) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          onClose();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [onClose]);

    return (
      <>
        <div
          ref={menuRef} // <-- Attach the ref here
          className='flex flex-col w-[25.6875rem] h-[15.5rem] rounded-xl justify-between bg-white'
        >
          <div className='flex flex-col'>
            <div className='w-full h-[5rem] gap-4 p-6 flex flex-row items-center justify-between'>
              <span className="font-jakarta font-semibold text-[#00192C] text-[1.25rem]/[1.75rem]">
                {t('shareStation')}
              </span>
              <div className='h-8 w-8 flex rounded-full justify-end'>
                <button className="transition-all hover:scale-125 group"
                        onClick={onClose}>
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
                  <button
                    className='h-full w-[10.84375rem] hover:bg-[#E8F2FF] transition-all rounded-xl p-2 gap-6 items-center justify-center flex'
                    onClick={handleCopyLink}
                    type="button"
                  >
                    <div className='gap-2 h-full w-full flex flex-row items-center'>
                      <CopyIcon className='w-5 h-5 text-[#00192C]'/>
                      <span className='font-jakarta font-medium text-[0.875rem]/[1.347rem] text-[#00192C]'>
                        {t('copyLink')}
                      </span>
                    </div>
                  </button>

                  <a
                    href={`mailto:?body=${t('mailTemplate', { url: stationPath })}`}
                    className='h-full w-[10.84375rem] hover:bg-[#E8F2FF] transition-all rounded-xl p-2 gap-6 items-center justify-center flex'
                  >
                    <div className='gap-2 h-full w-full flex flex-row items-center'>
                      <EnvelopeClosedIcon className='w-5 h-5 text-[#00192C]'/>
                      <span className='font-jakarta font-medium text-[0.875rem]/[1.347rem] text-[#00192C]'>
                        {t('mail')}
                      </span>
                    </div>
                  </a>
                </div>

                <div className='gap-4 w-full h-8 flex flex-row'>
                  <a
                    href={`https://x.com/intent/tweet?text=${encodeURIComponent(t('mediaTemplate', { url: stationPath }))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='h-full w-[10.84375rem] hover:bg-[#E8F2FF] transition-all rounded-xl p-2 gap-6 items-center justify-center flex'
                  >
                    <div className='gap-2 h-full w-full flex flex-row items-center'>
                      <img src="/assets/twitter.svg" alt="Twitter" className="w-6 h-6" />
                      <span className='font-jakarta font-medium text-[0.875rem]/[1.347rem] text-[#00192C]'>
                        X
                      </span>
                    </div>
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(t('mediaTemplate', { url: stationPath }))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='h-full w-[10.84375rem] hover:bg-[#E8F2FF] transition-all rounded-xl p-2 gap-6 items-center justify-center flex'
                  >
                    <div className='gap-2 h-full w-full flex flex-row items-center'>
                      <img src="/assets/wp.svg" alt="wp" className="w-6 h-6" />
                      <span className='font-jakarta font-medium text-[0.875rem]/[1.347rem] text-[#00192C]'>
                        WhatsApp
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {copied && <CopySuccess />}
      </>
    );
};
