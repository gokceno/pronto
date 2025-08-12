import React from "react";
import { Link } from "@remix-run/react";
import { formatStationName } from "../utils/helpers";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import ListContextMenu from "./pop-ups/list-context-menu";
import ShareMenu from "./pop-ups/share-menu";
import FavButton from "../utils/fav-button.jsx";
import { useFetcher } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { generateLocalizedRoute } from "../utils/generate-route.jsx";

export function ListCard({
  title,
  description = "",
  stationList = [],
  locale,
  id,
  onDelete,
  darkMode = false,
  user,
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [shareMenuOpen, setShareMenuOpen] = React.useState(false);
  const menuRef = React.useRef();
  const fetcher = useFetcher();
  const { t } = useTranslation();

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setShareMenuOpen(false);
      }
    }
    if (menuOpen || shareMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, shareMenuOpen]);

  React.useEffect(() => {
    if (shareMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [shareMenuOpen]);
  return (
    <Link
      to={generateLocalizedRoute(locale, `/details/list/${id}`)}
      className={`${darkMode ? "bg-[#00192C]/90" : "bg-white"} w-[18.875rem] min-h-[7.25rem]
      rounded-lg border border-[#BDC0C2] p-3 gap-8 transition-all duration-300 hover:border-[#167AFE]`}
    >
      <div className="w-full h-full gap-6 flex flex-col">
        <div className="w-full h-[1.75rem] flex flex-row gap-2 items-center justify-between">
          <span
            className={`font-jakarta font-semibold text-xl ${darkMode ? "text-white" : "text-[#00192C]"}`}
          >
            {title}
          </span>
          <div className="relative flex items-center gap-2" ref={menuRef}>
            <FavButton
              targetId={id}
              targetType="list"
              className={`${darkMode ? "text-white hover:text-red-400" : "text-gray-400 hover:text-black"}`}
              user={user}
            />
            <button
              className="hover:bg-[#E8F2FF] w-8 h-8 focus:bg-[#E8F2FF] rounded-full transition-all group/button flex items-center justify-center"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <DotsVerticalIcon className="w-6 h-6 text-[#A1A1AA]" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-20 mt-2 shadow-2xl drop-shadow-lg rounded-xl">
                <ListContextMenu
                  locale={locale}
                  listId={id}
                  onDelete={() => {
                    if (onDelete) {
                      onDelete(id);
                    } else {
                      fetcher.submit(
                        { userListId: id },
                        {
                          method: "delete",
                          action: "/api/radio-lists?operation=delete-list",
                          encType: "application/json",
                        },
                      );
                    }
                    setMenuOpen(false);
                  }}
                  onShare={() => {
                    setMenuOpen(false);
                    setShareMenuOpen(true);
                  }}
                />
              </div>
            )}
            {shareMenuOpen && (
              <ShareMenu
                open={true}
                locale={locale}
                onClose={() => setShareMenuOpen(false)}
                name={title}
                type={"list"}
              />
            )}
          </div>
        </div>

        <div className="w-full h-10 flex items-center">
          {stationList && stationList.length > 0 ? (
            stationList.map((station, idx) => (
              <div
                key={`${station.id || station.radioName || idx}`}
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white font-semibold text-sm"
                style={{
                  background: "#8C8CE4",
                  marginLeft: idx === 0 ? 0 : -16,
                  zIndex: stationList.length + idx,
                }}
              >
                <span className="font-jakarta font-semibold text-[0.75rem]">
                  {formatStationName(station.radioName || station.name || "")}
                </span>
              </div>
            ))
          ) : (
            <span className="text-sm text-gray-500 italic">
              {t("noListItems")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
