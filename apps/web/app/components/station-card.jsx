import { useTranslation } from "react-i18next";
import { DotsVerticalIcon, DotFilledIcon } from "@radix-ui/react-icons";
import PlayButton from "../utils/play-button";
import { useState } from "react";
import StationCardContextMenu from "./pop-ups/station-card-context-menu";
import { useRef, useEffect } from "react";
import ShareMenu from "./pop-ups/share-menu";
import { formatNumber } from "../utils/format-number.js";
import { formatStationName } from "../utils/helpers";
import PropTypes from "prop-types";
import { AddToListMenu } from "./pop-ups/add-to-list-menu";

export default function StationCard({
  locale = "en",
  name = "default",
  votes = "0",
  clickCount = "0",
  stationuuid = "",
  url = "",
  country = "",
  stationList = [],
  favicon = "",
  onNavigate,
}) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [addToListMenuOpen, setAddToListMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setShareMenuOpen(false);
        setAddToListMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="w-full max-w-[25.666875rem] h-[5rem] flex flex-row items-center gap-3 bg-white rounded-lg">
      <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
        {favicon ? (
          <img
            src={favicon}
            alt={`${name}-favicon`}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              const img = e.currentTarget;
              img.onerror = null;
              img.src = "/assets/default-station.png";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-[#5539B2] to-[#D4C7FD] flex items-center rounded-full justify-center text-white text-[1.5rem]/[2rem] font-semibold select-none capitalize">
            {formatStationName(name || "")}
          </div>
        )}
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

        <div
          className="relative flex flex-row gap-2 items-center"
          ref={menuRef}
        >
          <div>
            <PlayButton
              stationId={stationuuid}
              name={name}
              url={url}
              country={country}
              clickcount={clickCount}
              votes={votes}
              className="w-[2rem] h-[2rem] object-cover rounded-full"
              stationList={stationList}
            />
          </div>
          <button
            className="hover:bg-[#E8F2FF] w-8 h-8 focus:bg-[#E8F2FF] rounded-full transition-all group/button flex items-center justify-center"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <DotsVerticalIcon className="w-5 h-5 text-[#8C9195] group-hover/button:text-[#167AFE] group-focus/button:text-[#167AFE]" />
          </button>
          {menuOpen && (
            <div
              className={`absolute left-1/2 -translate-x-1/2 bottom-12 z-30 transition-opacity duration-300 ${
                menuOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              <StationCardContextMenu
                locale={locale}
                onClose={() => setMenuOpen(false)}
                onShare={() => {
                  setMenuOpen(false);
                  setShareMenuOpen(true);
                }}
                onAddToList={() => {
                  setMenuOpen(false);
                  setAddToListMenuOpen(true);
                }}
                stationuuid={stationuuid}
                onNavigate={onNavigate}
              />
            </div>
          )}
          {shareMenuOpen && (
            <ShareMenu
              open={true}
              type={"station"}
              locale={locale}
              onClose={() => setShareMenuOpen(false)}
              name={name}
            />
          )}
          {addToListMenuOpen && (
            <AddToListMenu
              stationuuid={stationuuid}
              onClose={() => setAddToListMenuOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

StationCard.propTypes = {
  locale: PropTypes.string,
  name: PropTypes.string,
  votes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  clickCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stationuuid: PropTypes.string,
  url: PropTypes.string,
  country: PropTypes.string,
  stationList: PropTypes.array,
  favicon: PropTypes.string,
  onNavigate: PropTypes.func,
};
