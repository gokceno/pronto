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
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-800 text-white py-4 px-6 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <img
              src="/assets/radio_pronto_icon.svg"
              alt="Radio Pronto"
              className="mr-2"
            />
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center text-white hover:text-yellow-200">
              <Link to={generateLocalizedRoute(locale, "/")} className="flex items-center">
                <HomeIcon className="w-6 h-6 mr-1" />
                <span className="text-xs sm:text-sm md:text-base truncate max-w-[60px] sm:max-w-none">
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
                <span className="text-xs sm:text-sm md:text-base truncate max-w-[50px] sm:max-w-none">
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
                <span className="text-xs sm:text-sm md:text-base truncate max-w-[60px] sm:max-w-none">
                  {t("countries")}
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/create-list"
            className="bg-yellow-300 text-black px-2 sm:px-4 py-1 sm:py-2 rounded-full flex items-center font-medium text-xs sm:text-sm md:text-base whitespace-nowrap transform scale-90 sm:scale-100"
          >
            <img
              src="/assets/music_list.svg"
              alt="music list"
              className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
            />
            <span className="truncate max-w-[80px] sm:max-w-none">
              {t("createRadioList")}
            </span>
          </Link>
          <Link to="/profile" className="bg-blue-600/20 p-2 rounded-full">
            <PersonIcon className="w-6 h-6 text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
}


