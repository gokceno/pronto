import { useTranslation } from "react-i18next";
import { DotsVerticalIcon, DotFilledIcon } from "@radix-ui/react-icons";
import PlayButton from "../utils/play-button";
import { useState } from "react";
import StationCardContextMenu from "./pop-ups/station-card-context-menu";
import { useRef, useEffect } from "react";
import ShareMenu from './pop-ups/share-menu';
import { formatNumber } from "../utils/format-number.js";

export default function StationCard({ 
    locale = "en", 
    name = "default", 
    votes = "0", 
    clickCount = "0" ,
    stationuuid = "",
    url = "",
    country = "",
    stationList = [],
    favicon
}) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setShareMenuOpen(false); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

    useEffect(() => {
      if (shareMenuOpen) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
      return () => {
        document.body.classList.remove('overflow-hidden');
      };
    }, [shareMenuOpen]);

  return (
    <div className="w-full max-w-[25.666875rem] h-[5rem] flex flex-row items-center gap-3 bg-white rounded-lg">
      <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
        {favicon ? (
          <img
            src={favicon}
            alt={`${name} favicon`}
            className="w-full h-full object-cover rounded-full"
            onError={e => { e.target.onerror = null; e.target.src = "/assets/default-station.png"; }}
          />
        ) : (
          <div className="w-full h-full bg-purple-400 flex items-center justify-center rounded-full"/>
          
        )}
        <div className="absolute">
          <PlayButton
            stationId={stationuuid}
            name={name}
            url={url}
            country={country}
            clickcount={clickCount}
            votes={votes}
            className="w-11 h-11 object-cover rounded-full"
            stationList={stationList}
          />
        </div>
      </div>

      <div className="flex-1 min-w-0 h-[2.625rem] gap-2 flex flex-row justify-between items-center">
        <div className="flex flex-col min-w-0">
          <span className="font-jakarta font-semibold text-[1rem]/[1.5rem] text-[#00192C] truncate">
            {name}
          </span>

          <div className="min-w-[9.8125rem] h-4 gap-1 flex flex-row">
            <span className="font-jakarta font-normal text-xs text-[#00192CA3]/65 gap-1 line">
            {formatNumber(locale, clickCount)} {t("cardListening")}
            </span>
            <DotFilledIcon className="text-[#00192CA3]/65 w-2 h-2 mt-1" />
            <span className="font-jakarta font-normal text-xs text-[#00192CA3]/65 gap-1">
            {formatNumber(locale, votes)} {t("likes")}
            </span>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            className="hover:bg-[#E8F2FF] w-8 h-8 focus:bg-[#E8F2FF] rounded-full transition-all group/button flex items-center justify-center"
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <DotsVerticalIcon className="w-5 h-5 text-[#8C9195] group-hover/button:text-[#167AFE] group-focus/button:text-[#167AFE]" />
          </button>
          {menuOpen && (
            <div
              className={`absolute left-1/2 -translate-x-1/2 bottom-12 z-20 transition-opacity duration-300 ${
                menuOpen ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <StationCardContextMenu
                locale={locale}
                onClose={() => setMenuOpen(false)}
                onShare={() => {
                  setMenuOpen(false);
                  setShareMenuOpen(true);
                }}
                stationuuid={stationuuid}
              />
            </div>
          )}
          {shareMenuOpen && (
            <>
              <div className="fixed inset-0 overflow-hidden" />
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <ShareMenu open={true} type={"station"} locale={locale} onClose={() => setShareMenuOpen(false)} name={name}/>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
