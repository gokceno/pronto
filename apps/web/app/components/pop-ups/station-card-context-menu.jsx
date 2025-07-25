import React from "react";
import { useTranslation } from "react-i18next";
import { HeartIcon, Share1Icon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { generateLocalizedRoute } from "../../utils/generate-route";

export default function StationCardContextMenu({
  locale,
  onClose,
  onShare,
  stationuuid = "",
  onAddToList,
  list = false,
  onNavigate,
}) {
  const { t } = useTranslation();

  return (
    <div className="w-[14.0625rem] h-auto flex p-4 gap-3 bg-white flex-col shadow-2xl drop-shadow-lg rounded-xl">
      <button className="flex flex-col w-full h-8 py-1 px-2 gap-2 hover:bg-[#E8F2FF] hover:rounded-lg transition-all">
        <div className="w-full h-6 gap-1 flex flex-row items-center">
          <img
            src="/assets/equalizer.svg"
            alt="equalizer"
            className="w-6 h-6 invert"
          />
          <Link
            to={generateLocalizedRoute(
              locale,
              `/details/station/${encodeURIComponent(stationuuid)}`,
            )}
            onClick={() => {
              if (onNavigate) onNavigate();
            }}
          >
            <span className="font-jakarta ml-1 font-medium text-[#00192C] text-[0.875rem]/[1.375rem]">
              {t("aboutStation")}
            </span>
          </Link>
        </div>
      </button>

      <div className="flex flex-col w-full gap-2">
        <div className="w-[12.0625rem] h-[0.0625rem] bg-gray-200" />
        {!list && (
          <button
            className="flex flex-col w-full h-8 py-1 px-2 hover:bg-[#E8F2FF] hover:rounded-lg transition-all"
            onClick={onAddToList}
          >
            <div className="w-full h-6 gap-1 flex flex-row items-center">
              <img
                src="/assets/music_list.svg"
                alt="music list"
                className="w-6 h-6"
              />
              <span className="font-jakarta ml-1 font-medium text-[#00192C] text-[0.875rem]/[1.375rem]">
                {t("addToList")}
              </span>
            </div>
          </button>
        )}
        <button
          className="flex flex-col w-full h-8 py-1 px-2 hover:bg-[#E8F2FF] hover:rounded-lg transition-all"
          onClick={onClose}
        >
          <div className="w-full h-6 gap-1 flex flex-row items-center">
            <EyeOpenIcon className="w-6 h-6 text-black" />
            <span className="font-jakarta ml-1 font-medium text-[#00192C] text-[0.875rem]/[1.375rem]">
              {t("showLess")}
            </span>
          </div>
        </button>
        <div className="w-[12.0625rem] h-[0.0625rem] bg-gray-200" />
      </div>

      <button
        className="flex flex-col w-full h-8 py-1 px-2 gap-2 hover:bg-[#E8F2FF] hover:rounded-lg transition-all"
        onClick={onShare}
      >
        <div className="w-full h-6  gap-1 flex flex-row items-center">
          <Share1Icon className="w-6 h-6 text-[#00192C]" />
          <span className="font-jakarta ml-1 font-medium text-[#00192C] text-[0.875rem]/[1.375rem]">
            {t("share")}
          </span>
        </div>
      </button>

      {list && (
        <div className="w-full h-full flex flex-col items-center gap-3 justify-center">
          <div className="w-[12.0625rem] h-[0.0625rem] bg-gray-200" />
          {list && (
            <button
              className="flex flex-col w-full h-8 py-1 px-2 hover:bg-[#E8F2FF] hover:rounded-lg transition-all"
              onClick={onAddToList}
            >
              <div className="w-full h-6 gap-1 flex flex-row items-center">
                <img
                  src="/assets/music_list.svg"
                  alt="music list"
                  className="w-6 h-6"
                />
                <span className="font-jakarta ml-1 font-medium text-[#DB0A3C] text-[0.875rem]/[1.375rem]">
                  {t("addToList")}
                </span>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
