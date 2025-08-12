import { Cross1Icon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import Backdrop from "../backdrop";

export const NoListMenu = ({ onClose }) => {
  const { t } = useTranslation();
  const [exiting, setExiting] = useState(false);
  const menuRef = useRef(null);

  const handleClose = () => {
    setExiting(true);
  };

  const handleAnimationEnd = (e) => {
    // Only trigger onClose when the menu itself animates out
    if (exiting && e.target === menuRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Backdrop show={true} onClick={handleClose} zIndex={1001}>
      <div
        ref={menuRef}
        className={`flex flex-col w-[25.6875rem] h-[27.875rem] rounded-xl justify-between bg-white ${exiting ? "animate-fade-out" : "animate-fade-in"}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="flex flex-col">
          <div className="w-full h-[5rem] gap-4 p-6 flex flex-row items-center justify-between">
            <span className="font-jakarta font-semibold text-[#00192C] text-[1.25rem]/[1.75rem]">
              {t("addToRadioList")}
            </span>

            <div className="h-8 w-8 flex rounded-full justify-end">
              <button
                className="transition-all hover:scale-125 group"
                onClick={handleClose}
              >
                <Cross1Icon className="w-6 h-6 text-[#A1A1AA] group-hover:text-[#DB0A3C]" />
              </button>
            </div>
          </div>
          <div className="w-full h-[0.0625rem] bg-gray-300" />
        </div>

        <div className="w-full h-full p-4 gap-8 flex flex-col items-center justify-between">
          <img
            src="/assets/empty-list.svg"
            alt="empty-list"
            className="w-30 h-30"
          />

          <div className="w-full h-[5.875rem] flex flex-col gap-4">
            <span className="font-jakarta font-semibold text-[1.25rem]/[1.75rem] text-[#167AFE] text-center">
              {t("noCreatedList")}
            </span>

            <span className="font-jakarta font-normal text-sm/[1.375rem] text-[#02141C] text-center whitespace-pre-line">
              {t("noCreatedListHeader")}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="px-4 transition-all hover:scale-105 rounded-[2rem] bg-[#167AFE] flex flex-row h-[2.5rem] gap-1 items-center justify-center"
          >
            <span className="font-jakarta font-semibold text-[0.875rem]/[1.375rem] text-white">
              {t("createNewList")}
            </span>
          </button>
        </div>
      </div>
    </Backdrop>
  );
};

NoListMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
};
