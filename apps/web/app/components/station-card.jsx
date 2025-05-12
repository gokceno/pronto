import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { DotsVerticalIcon, DotFilledIcon } from "@radix-ui/react-icons";

export default function StationCard({ locale = "en", name = "default", votes = "0", clickCount = "0" }) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-[25.666875rem] h-[5rem] flex flex-row items-center gap-3 bg-white rounded-lg">
      <div className="flex-shrink-0 w-20 h-20 rounded-full bg-purple-400 flex items-center justify-center">
        <img
          src="/assets/play-banner.svg"
          alt="Play Banner"
          className="w-12 h-12 object-cover rounded-full"
        />
      </div>

      <div className="flex-1 min-w-0 h-[2.625rem] gap-2 flex flex-row justify-between items-center">
        <div className="flex flex-col min-w-0">
          <span className="font-jakarta font-semibold text-[1rem]/[1.5rem] text-[#00192C] truncate">
            {name}
          </span>

          <div className="min-w-[9.8125rem] h-4 gap-1 flex flex-row">
            <span className="font-jakarta font-normal text-xs text-[#00192CA3]/65 gap-1 line">
              {clickCount} {t("cardListening")}
            </span>
            <DotFilledIcon className="text-[#00192CA3]/65 w-2 h-2 mt-1" />
            <span className="font-jakarta font-normal text-xs text-[#00192CA3]/65 gap-1">
              {votes} {t("likes")}
            </span>
          </div>
        </div>

        <button className="hover:bg-[#E8F2FF] w-8 h-8 focus:bg-[#E8F2FF] rounded-full transition-all group/button flex items-center justify-center">
          <DotsVerticalIcon className="w-5 h-5 text-[#8C9195] group-hover/button:text-[#167AFE] group-focus/button:text-[#167AFE]" />
        </button>
      </div>
    </div>
  );
}
