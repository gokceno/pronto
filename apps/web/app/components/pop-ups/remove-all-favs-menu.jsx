import { Cross1Icon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";

export const RemoveAllFavorites = ({ type, isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="flex flex-col w-[25.6875rem] h-[25.875rem] rounded-xl justify-between bg-white"
      >
        <div className="w-full h-[1rem] gap-4 p-6 flex justify-end">
          <div className="h-8 w-8 flex rounded-full justify-end">
            <button
              className="transition-all hover:scale-125 group"
              onClick={onClose}
            >
              <Cross1Icon className="w-6 h-6 text-[#A1A1AA] group-hover:text-[#DB0A3C]" />
            </button>
          </div>
        </div>

        <div className="px-6 gap-6 flex flex-col w-full h-auto py-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <img
              src="/assets/remove-fav.svg"
              alt="Remove from favs"
              className="w-30 h-30"
            />
            <div className="w-full h-5.875rem gap-4 flex flex-col text-center">
              <span className="font-jakarta font-semibold text-xl whitespace-pre-line text-[#DB0A3C]">
                {(() => {
                  switch (type) {
                    case "country":
                      return t("removeAllCountry");
                    case "list":
                      return t("removeAllList");
                    case "radio":
                      return t("removeAllStation");
                    default:
                      return "";
                  }
                })()}
              </span>
              <span className="text-[1.25rem]/[1.75rem] text-[#DB0A3C] font-jakarta font-semibold">
                {t("areYouSure")}
              </span>
              <span className="text-sm text-[#02141C] font-jakarta font-normal">
                {t("areYouSureAgain")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="w-full h-[0.0625rem] bg-gray-300" />
          <div className="w-full h-auto flex flex-row justify-between items-center p-4">
            <button
              className="gap-2 items-center justify-center relative group"
              onClick={onClose}
            >
              <span className="font-jakarta font-semibold text-sm/[1.375rem] text-[#167AFE]">
                {t("abort")}
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-[0.1rem] bg-[#167AFE] transition-all duration-300 group-hover:w-full"></span>
            </button>

            <button
              className="px-4 transition-all hover:scale-105 rounded-[2rem] bg-[#DB0A3C] h-[2.5rem] gap-1 items-center justify-center w-auto min-w-[8rem]"
              onClick={onConfirm}
            >
              <span className="font-jakarta font-semibold text-sm/[1.375rem] text-white whitespace-nowrap">
                {t("confirmFavRemove")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
