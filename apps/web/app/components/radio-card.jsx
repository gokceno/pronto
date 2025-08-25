import Truncate from "../components/truncate.jsx";
import { formatStationName, formatStationTag } from "../utils/helpers";
import { useTranslation } from "react-i18next";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { generateLocalizedRoute } from "../utils/generate-route.jsx";
import PlayButton from "../utils/play-button.jsx";
import FavButton from "../utils/fav-button.jsx";
import { useState, useRef, useEffect } from "react";
import StationCardContextMenu from "./pop-ups/station-card-context-menu";
import ShareMenu from "./pop-ups/share-menu";
import { AddToListMenu } from "./pop-ups/add-to-list-menu";
import { CreateNewListMenu } from "./pop-ups/create-new-list-menu";
import { formatNumber } from "../utils/format-number.js";

const RadioCard = ({
  stationuuid,
  name,
  tags,
  clickcount,
  votes,
  url,
  country,
  locale,
  stationList,
  favicon,
  user,
  isDeleted,
}) => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const shareMenuRef = useRef(null);
  const [addToListMenuOpen, setAddToListMenuOpen] = useState(false);
  const [createListMenuOpen, setCreateListMenuOpen] = useState(false);
  const addToListMenuRef = useRef(null);
  const createListMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const menuClicked =
        menuRef.current && menuRef.current.contains(event.target);
      const shareMenuClicked =
        shareMenuRef.current && shareMenuRef.current.contains(event.target);
      const addToListMenuClicked =
        addToListMenuRef.current &&
        addToListMenuRef.current.contains(event.target);
      const createListMenuClicked =
        createListMenuRef.current &&
        createListMenuRef.current.contains(event.target);

      if (
        !menuClicked &&
        !shareMenuClicked &&
        !addToListMenuClicked &&
        !createListMenuClicked
      ) {
        setMenuOpen(false);
        setShareMenuOpen(false);
        setAddToListMenuOpen(false);
        setCreateListMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, shareMenuRef, addToListMenuRef, createListMenuRef]);

  const genres = (tags || [])
    .filter((tag) => tag && typeof tag === "string")
    .slice(0, 6)
    .map((tag) => (
      <Link
        key={`${stationuuid}-${tag}`}
        to={generateLocalizedRoute(
          locale,
          `/details/genre/${encodeURIComponent(tag)}`,
        )}
        className="h-[1.6875rem] px-2 py-1 bg-blue-100 text-blue-800 hover:scale-105 transition-all rounded-lg font-semibold text-xs capitalize"
      >
        {formatStationTag(tag)}
      </Link>
    ));

  // Add safety checks for required props
  if (!stationuuid || !name) {
    console.warn("RadioCard: Missing required props", { stationuuid, name });
    return null;
  }

  return (
    <div
      className={`flex flex-col overflow-visible bg-white rounded-xl border border-gray-200 p-4 flex-shrink-0 justify-between gap-3 min-w-[18.875rem] min-h-[13.875rem] ${Boolean(isDeleted) ? "relative" : ""}`}
    >
      {/* Deleted indicator overlay */}
      {Boolean(isDeleted) && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
            {t("deleted") || "Deleted"}
          </span>
        </div>
      )}

      {/* Title,likes, count */}
      <div className={`flex gap-2`}>
        {favicon ? (
          <img
            src={favicon}
            alt={`${name} favicon`}
            className="flex items-center flex-shrink-0 h-11 w-11 rounded-full justify-center text-white text-xs font-semibold select-none capitalize object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/assets/default-station.png";
            }}
          />
        ) : (
          <div className="flex items-center flex-shrink-0 h-11 w-11 rounded-full justify-center bg-gradient-to-tr from-[#5539B2] to-[#D4C7FD] text-white text-xs font-semibold select-none capitalize">
            {formatStationName(name || "Unknown")}
          </div>
        )}
        <div className={`flex flex-col`}>
          <div className={`text-base font-semibold text-gray-900`}>
            <Truncate>{name || "Unknown Station"}</Truncate>
          </div>
          <div className={`text-xs text-[#00192CA3]/[0.64]`}>
            {formatNumber(locale, clickcount || 0)} {t("listeningCount")} •{" "}
            {formatNumber(locale, votes || 0)} {t("likes")}
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
            name={name || "Unknown Station"}
            url={url || ""}
            country={country || ""}
            clickcount={clickcount || 0}
            votes={votes || 0}
            className="text-white rounded-full"
            stationList={stationList || []}
            disabled={Boolean(isDeleted)}
          />
        </div>

        <div className={`flex items-center gap-4 relative`} ref={menuRef}>
          <FavButton
            targetId={stationuuid}
            targetType="radio"
            user={user}
            locale={locale}
            disabled={Boolean(isDeleted)}
          />

          <button
            className={`text-gray-400 hover:text-black focus:bg-[#E8F2FF]
              rounded-full w-6 h-6 group/button focus:outline-none hover:scale-110 transition-all flex items-center justify-center ${Boolean(isDeleted) ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !Boolean(isDeleted) && setMenuOpen((prev) => !prev)}
            disabled={Boolean(isDeleted)}
          >
            <DotsVerticalIcon
              className="w-5 h-5 group-hover/button:text-[#167AFE] group-focus/button:text-[#167AFE]"
              alt="Context Menu"
            />
          </button>
          {menuOpen && !Boolean(isDeleted) && (
            <div
              className={`absolute left-1/2 -translate-x-1/2 bottom-12 z-20 transition-opacity duration-300 ${
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
              />
            </div>
          )}
          {shareMenuOpen && !Boolean(isDeleted) && (
            <ShareMenu
              open={true}
              type={"station"}
              locale={locale}
              onClose={() => setShareMenuOpen(false)}
              name={name}
              parentRef={shareMenuRef}
            />
          )}
          {addToListMenuOpen && !Boolean(isDeleted) && (
            <AddToListMenu
              stationuuid={stationuuid}
              onClose={() => setAddToListMenuOpen(false)}
              parentRef={addToListMenuRef}
              onCreateList={() => {
                setAddToListMenuOpen(false);
                setCreateListMenuOpen(true);
              }}
            />
          )}
          {createListMenuOpen && !Boolean(isDeleted) && (
            <CreateNewListMenu
              onClose={() => setCreateListMenuOpen(false)}
              parentRef={createListMenuRef}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RadioCard;
