import { useTranslation } from "react-i18next";
import { DotsVerticalIcon, DotFilledIcon } from "@radix-ui/react-icons";
import PlayButton from "../utils/play-button";
import { useState } from "react";
import StationCardContextMenu from "./pop-ups/station-card-context-menu";
import { useRef, useEffect } from "react";


export default function StationCard({ 
    locale = "en", 
    name = "default", 
    votes = "0", 
    clickCount = "0" ,
    stationuuid = "",
    url = "",
    country = "",
    stationList = [],
}) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="w-full max-w-[25.666875rem] h-[5rem] flex flex-row items-center gap-3 bg-white rounded-lg">
      <div className="flex-shrink-0 w-20 h-20 rounded-full bg-purple-400 flex items-center justify-center">
        <PlayButton
          stationId={stationuuid}
          name={name}
          url={url}
          country={country}
          clickcount={clickCount}
          votes={votes}
          className="w-12 h-12 object-cover rounded-full"
          stationList={stationList}
          type="banner"
        />
      </div>

      <div className="flex-1 min-w-0 h-[2.625rem] gap-2 flex flex-row justify-between items-center">
        <div className="flex flex-col min-w-0">
          <span className="font-jakarta font-semibold text-[1rem]/[1.5rem] text-[#00192C] truncate">
            {name}
          </span>

          <div className="min-w-[9.8125rem] h-4 gap-1 flex flex-row">
            <span className="font-jakarta font-normal text-xs text-[#00192CA3]/65 gap-1 line">
              {clickCount} {t("cardListening")}
            </span>
            <DotFilledIcon className="text-[#00192CA3]/65 w-2 h-2 mt-1" />
            <span className="font-jakarta font-normal text-xs text-[#00192CA3]/65 gap-1">
              {votes} {t("likes")}
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
              className={`absolute left-1/2 -translate-x-1/2 top-12 z-20 transition-opacity duration-300 ${
                menuOpen ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <StationCardContextMenu locale={locale} onClose={() => setMenuOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
