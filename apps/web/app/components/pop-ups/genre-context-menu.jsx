import { HeartIcon, Share1Icon, EyeOpenIcon } from "@radix-ui/react-icons";

export const GenreContextMenu = ({ t, popupRef, onShare, onClose }) => (
  <div
    ref={popupRef}
    className="absolute top-full right-0 mt-2 w-[14.0625rem] h-[9rem] bg-white rounded-xl p-4 gap-3 shadow-2xl drop-shadow-lg flex flex-col z-[9999]"
  >
    <div className="w-full h-[3.5rem] flex flex-col">
      <button className="w-full h-8 py-2 px-1 gap-2 flex flex-row items-center hover:bg-gray-100 rounded-md transition-all cursor-pointer">
        <img
          src="/assets/music_list.svg"
          alt="music list"
          className="w-6 h-6"
        />
        <span className="font-jakarta font-medium text-sm/[1.375rem] text-[#00192C]">
          {t("addToList")}
        </span>
      </button>

      <button
        className="w-full h-8 py-2 px-1 gap-2 flex flex-row items-center hover:bg-gray-100 rounded-md transition-all cursor-pointer"
        onClick={onClose}
      >
        <EyeOpenIcon className="w-6 h-6" />
        <span className="font-jakarta font-medium text-sm/[1.375rem] text-[#00192C]">
          {t("showLess")}
        </span>
      </button>
    </div>

    <div className="w-[12.0625rem] h-[2rem] mt-1">
      <div className="w-full h-[0.0625rem] mb-4 bg-gray-200"></div>
      <div
        className="gap-2 flex flex-row items-center hover:bg-gray-100 p-1 rounded-md transition-all cursor-pointer"
        onClick={onShare}
      >
        <Share1Icon className="w-6 h-6" />
        <span className="font-jakarta font-medium text-sm/[1.375rem] text-[#00192C]">
          {t("share")}
        </span>
      </div>
    </div>
  </div>
);
