import Truncate from "../components/truncate.jsx";
import { formatStationName, formatStationTag } from "../utils/helpers";
import { useTranslation } from "react-i18next";
import { HeartIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { generateLocalizedRoute } from "../utils/generate-route.jsx";
import PlayButton from "../utils/play-button.jsx";
import { useState, useRef, useEffect } from "react";
import StationCardContextMenu from "./pop-ups/station-card-context-menu";
import ShareMenu from "./pop-ups/share-menu";

const RadioCard = ({
  stationuuid,
  name,
  tags,
  clickcount,
  votes,
  url,
  country,
  locale,
  stationList
}) => {
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

  const genres = tags
    .slice(0, 6)
    .map((tag) => (
      <Link 
        key={`${stationuuid}-${tag}`}
        to={generateLocalizedRoute(locale, `/details/genre/${encodeURIComponent(tag)}`)}
        className="h-[1.6875rem] px-2 py-1 bg-blue-100 text-blue-800 hover:scale-105 transition-all rounded-lg font-bold text-xs capitalize"
      >
        {formatStationTag(tag)}
      </Link>
    ));

  return (
    <div
      className={`flex flex-col overflow-visible bg-white rounded-xl border border-gray-200 p-4 flex-shrink-0 justify-between gap-3 min-w-[18.875rem] min-h-[13.875rem]`}
    >
      {/* Title,likes, count */}
      <div className={`flex gap-2`}>
        <div
          className={`flex items-center flex-shrink-0 h-11 w-11 bg-gradient-to-tr from-[#5539B2] to-[#D4C7FD] rounded-full justify-center text-white text-xs font-semibold select-none capitalize`}
        >
          {formatStationName(name)}
        </div>
        <div className={`flex flex-col`}>
          <div className={`text-base font-semibold text-gray-900`}>
            <Truncate>{name}</Truncate>
          </div>
          <div className={`text-xs text-[#00192CA3]/[0.64]`}>
            {clickcount} {t("listeningCount")} • {votes} {t("likes")}
          </div>
        </div>
      </div>

      {/* Tag */}
      <div className="h-[3.75rem] ml-0.5 flex flex-wrap gap-1.5 select-none justify-start">
        {genres}
      </div>
      {/* Play, like, context */}
      <div className={`flex justify-between mt-3`}>
        <div className={`flex items-center`}>
          <PlayButton
            stationId={stationuuid}
            name={name}
            url={url}
            country={country}
            clickcount={clickcount}
            votes={votes}
            className="text-white rounded-full"
            stationList={stationList}
          />
        </div>

        <div className={`flex items-center gap-4 relative`} ref={menuRef}>
          <button
            className={`text-gray-400 hover:text-black focus:outline-none cursor-pointer hover:scale-110 transition-all`}
          >
            {/* Like button */}
            <HeartIcon className="w-5 h-5" alt="Like Button" />
          </button>

          <button
            className={`text-gray-400 hover:text-black focus:bg-[#E8F2FF]
              rounded-full w-6 h-6 group/button focus:outline-none hover:scale-110 transition-all flex items-center justify-center`}
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <DotsVerticalIcon className="w-5 h-5 group-hover/button:text-[#167AFE] group-focus/button:text-[#167AFE]" alt="Context Menu" />
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
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                <ShareMenu open={true} locale={locale} onClose={() => setShareMenuOpen(false)} radioName={name}/>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RadioCard;