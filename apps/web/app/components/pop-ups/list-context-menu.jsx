import { Share1Icon, TrashIcon } from "@radix-ui/react-icons";
import { generateLocalizedRoute } from "../../utils/generate-route";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";

export default function ListContextMenu({
  locale,
  listId = "",
  onDelete,
  onShare,
}) {
  const { t } = useTranslation();

  return (
    <div
      className="w-[14.0625rem] h-auto flex p-4 gap-3 bg-white flex-col shadow-lg drop-shadow-lg rounded-xl z-50"
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
      }}
    >
      <div className="flex flex-col w-full gap-2">
        <Link
          to={generateLocalizedRoute(
            locale,
            `/details/list/${encodeURIComponent(listId)}`,
          )}
          className="flex flex-col w-full h-8 py-1 px-2 gap-2 hover:bg-[#E8F2FF] hover:rounded-lg transition-all"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <div className="w-full h-6 gap-1 flex flex-row items-center">
            <img
              src="/assets/music_list.svg"
              alt="music_list"
              className="w-6 h-6"
            />
            <span className="font-jakarta ml-1 font-medium text-[#00192C] text-[0.875rem]/[1.375rem]">
              {t("aboutList")}
            </span>
          </div>
        </Link>
        {/*<Link
          to={generateLocalizedRoute(
            locale,
            `/details/music-list/${encodeURIComponent(listId)}`,
          )}
          className="flex flex-col w-full h-8 py-1 px-2 gap-2 hover:bg-[#E8F2FF] hover:rounded-lg transition-all no-underline"
        >
          <div className="w-full h-6 gap-1 flex flex-row items-center">
            <Pencil1Icon className="w-6 h-6 text-[#00192C]" />
            <span className="font-jakarta ml-1 font-medium text-[#00192C] text-[0.875rem]/[1.375rem]">
              {t("edit")}
            </span>
          </div>
        </Link>*/}
      </div>

      <div className="flex flex-col w-full gap-2">
        <div className="w-[12.0625rem] h-[0.0625rem] bg-gray-200" />
        <button
          className="flex flex-col w-full h-8 py-1 px-2 gap-2 hover:bg-[#E8F2FF] hover:rounded-lg transition-all"
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            onShare();
          }}
        >
          <div className="w-full h-6  gap-1 flex flex-row items-center">
            <Share1Icon className="w-6 h-6 text-[#00192C]" />
            <span className="font-jakarta ml-1 font-medium text-[#00192C] text-[0.875rem]/[1.375rem]">
              {t("share")}
            </span>
          </div>
        </button>
        <div className="w-[12.0625rem] h-[0.0625rem] bg-gray-200" />
      </div>

      <button
        className="flex flex-col w-full h-8 py-1 px-2 gap-2 hover:bg-[#FF4D6D] text-[#FF000DB0] hover:text-white hover:rounded-lg transition-all"
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          onDelete();
        }}
      >
        <div className="w-full h-6 gap-1 flex flex-row items-center group ">
          <TrashIcon className="w-6 h-6  transition-colors duration-150" />
          <span className="font-jakarta ml-1 font-medium text-[0.875rem]/[1.375rem] transition-colors duration-150 ">
            {t("deleteList")}
          </span>
        </div>
      </button>
    </div>
  );
}
