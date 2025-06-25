import React from "react";
import { formatStationName } from "../utils/helpers";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import ListContextMenu from "./pop-ups/list-context-menu";
import ShareMenu from "./pop-ups/share-menu";

export function ListCard({
  title,
  stationList,
  locale,
  listId = "000",
  onDelete,
  darkMode = false,
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [shareMenuOpen, setShareMenuOpen] = React.useState(false);
  const menuRef = React.useRef();

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
    <div
      className={`${darkMode ? "bg-[#00192C]/90" : "bg-white"} min-w-[18.875rem] min-h-[7.25rem]
      rounded-lg border border-[#BDC0C2] p-3 gap-8 transition-all duration-300 hover:border-[#167AFE]`}
    >
      <div className="w-full h-full gap-6 flex flex-col">
        <div className="w-full h-[1.75rem] flex flex-row gap-2 items-center justify-between">
          <span
            className={`font-jakarta font-semibold text-xl ${darkMode ? "text-white" : "text-[#00192C]"}`}
          >
            {title}
          </span>
          <div className="relative" ref={menuRef}>
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
                  listId={listId}
                  onDelete={onDelete}
                  onShare={() => {
                    setMenuOpen(false);
                    setShareMenuOpen(true);
                  }}
                />
              </div>
            )}
            {shareMenuOpen && (
              <>
                <div className="fixed inset-0 overflow-hidden" />
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <ShareMenu
                    open={true}
                    locale={locale}
                    onClose={() => setShareMenuOpen(false)}
                    name={title}
                    type={"list"}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="w-full h-10 flex items-center">
          {stationList?.map((station, idx) => (
            <div
              key={`${station}-${idx}`}
              className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white font-semibold text-sm"
              style={{
                background: "#8C8CE4",
                marginLeft: idx === 0 ? 0 : -16,
                zIndex: stationList.length + idx,
              }}
            >
              <span className="font-jakarta font-semibold text-[0.75rem]">
                {formatStationName(station)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
