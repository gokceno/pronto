import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import {
  HomeIcon,
  LightningBoltIcon,
  GlobeIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { generateLocalizedRoute } from "../utils/generate-route";

export default function Header({ locale }) {
  const { t } = useTranslation();
  return (
    <div className="fixed w-full top-0 left-0 right-0 z-50 bg-blue-800 text-white py-4 px-8 shadow-md">
      <div className="flex md:justify-between items-center">
        <div className="flex items-center md:space-x-6">
          <div className="flex items-center">
            <Link to={generateLocalizedRoute(locale, "/")}>
              <img
                src="/assets/radio_pronto_icon.svg"
                alt="Radio Pronto"
                className="md:mr-2 w-3/4 h-3/4 md:w-full md:h-full"
              />
            </Link>
          </div>
          <div className="flex items-center -ml-4 md:-ml-0 space-x-2 md:space-x-4">
            <div className="flex items-center text-white hover:text-yellow-200">
              <Link to={generateLocalizedRoute(locale, "/")} className="flex items-center">
                <HomeIcon className="w-6 h-6 mr-1" />
                <span className="hidden md:flex text-xs sm:text-sm md:text-base truncate max-w-[3.75rem] sm:max-w-none">
                  {t("homePage")}
                </span>
              </Link>
            </div>

            <Link
              to={generateLocalizedRoute(locale, "/genres")}
              className="flex items-center"
            >
              <div className="flex items-center text-white hover:text-yellow-200">
                <LightningBoltIcon className="w-6 h-6 mr-1" />
                <span className="hidden md:flex text-xs sm:text-sm md:text-base truncate max-w-[3.125rem] sm:max-w-none">
                  {t("genres")}
                </span>
              </div>
            </Link>

            <div className="flex items-center text-white hover:text-yellow-200">
              <Link
                to={generateLocalizedRoute(locale, "/countries")}
                className="flex items-center"
              >
                <GlobeIcon className="w-6 h-6 mr-1" />
                <span className="hidden md:flex text-xs sm:text-sm md:text-base truncate max-w-[3.75rem] sm:max-w-none">
                  {t("countries")}
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex md:ml-0 ml-4 items-center py-4 gap-1">
          <Link
            to="/create-list"
            className="bg-[#E6E953] text-black whitespace-nowrap md:h-[2.5rem] md:w-[12.0625rem] ml-2 px-2 py-1 rounded-full flex font-jakarta items-center
             font-semibold text-[0.875rem]/[1.375rem] transform"
          >
            <img
              src="/assets/music_list.svg"
              alt="music list"
              className="w-6 h-6 md:mx-1"
            />
            <span className="hidden md:flex">
              {t("createRadioList")}
            </span>
          </Link>
          <Link to="/profile" className="bg-blue-600/20 md:p-2 rounded-full">
            <PersonIcon className="w-6 h-6 text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
}


