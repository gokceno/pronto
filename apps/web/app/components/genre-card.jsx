import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import Truncate from "./truncate.jsx";
import { generateLocalizedRoute } from "../utils/generate-route.jsx";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { GenreContextMenu } from "./pop-ups/genre-context-menu.jsx";
import ShareMenu from "./pop-ups/share-menu.jsx";
import { formatNumber } from "../utils/format-number.js";

const colorCombinations = [
  "from-[#ECB8C8] to-[#E59E18]",
  "from-[#EAE2BE] to-[#2555E3]",
  "from-[#EAE3BA] to-[#E226B3]",
  "from-[#BCE3E8] to-[#FB4125]",
  "from-[#E1D4B6] to-[#7E25DE]",
  "from-[#DDBFBF] to-[#31B86E]",
  "from-[#E2CCBE] to-[#009FDE]",
  "from-[#DECDFF] to-[#127EA6]",
  "from-[#EAE3BA] to-[#E226B3]",
];

export const GenreCard = ({ name, stationcount = 0, locale, index = 0 }) => {
  const { t } = useTranslation();
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const colorIndex = index % colorCombinations.length;
  const genreColor = colorCombinations[colorIndex];
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const togglePopup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPopup((prev) => !prev);
  };

  return (
    <>
      <div
        className="w-full max-w-[18.875rem] h-[8.75rem] relative overflow-visible
        hover:shadow-2xl rounded-xl transition-all duration-300"
      >
        <Link
          to={generateLocalizedRoute(
            locale,
            `/details/genre/${encodeURIComponent(name.toLowerCase())}`,
          )}
          className="block h-full"
        >
          <div
            className={`h-full bg-gradient-to-tl ${genreColor} rounded-lg p-4 transition-all `}
          >
            <div className="flex flex-col h-full justify-between relative">
              <div className="flex flex-row justify-between items-center">
                <span className="bg-[#E8F2FF] text-[#1057B4] text-xs font-jakarta font-semibold rounded-md px-2 py-1">
                  {t("cardStations", {
                    count: formatNumber(locale, stationcount),
                  })}
                </span>
              </div>
              <span className="text-white text-[1.5rem]/[2rem] font-jakarta capitalize font-semibold">
                <Truncate>{name}</Truncate>
              </span>
            </div>
          </div>
        </Link>
        <div className="absolute top-4 right-4 z-10">
          <button
            ref={buttonRef}
            onClick={togglePopup}
            className="p-1 hover:bg-[#E8F2FF] focus:bg-[#E8F2FF] rounded-full transition-all group/button"
          >
            <DotsVerticalIcon className="text-white group-hover/button:text-[#167AFE] group-focus/button:text-[#167AFE] w-5 h-5 transition-colors" />
          </button>
          {showPopup && (
            <GenreContextMenu
              t={t}
              popupRef={popupRef}
              onShare={() => {
                setShowPopup(false);
                setShowShareMenu(true);
              }}
              onClose={() => setShowPopup(false)}
            />
          )}
        </div>
      </div>
      {showShareMenu && (
        <ShareMenu
          open={true}
          type={"genre"}
          locale={locale}
          onClose={() => setShowShareMenu(false)}
          name={name.toUpperCase()}
        />
      )}
    </>
  );
};
