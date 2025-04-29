import { Link, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import {
  HomeIcon,
  LightningBoltIcon,
  GlobeIcon,
  PersonIcon,
  ChevronDownIcon,
  CheckIcon
} from "@radix-ui/react-icons";
import { generateLocalizedRoute } from "../utils/generate-route";
import { useState } from "react";
import i18n from "../i18n";

export default function Header({ locale }) {
  const { t } = useTranslation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const location = useLocation();
  
  const toggleLanguageMenu = () => {
    setShowLanguageMenu(!showLanguageMenu);
  };

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
            className="bg-[#E6E953] text-black whitespace-nowrap md:h-[2.5rem] md:min-w-[8rem] md:max-w-[12.0625rem] ml-2 px-2 py-1 rounded-full flex font-jakarta items-center justify-center
             font-semibold text-[0.875rem]/[1.375rem] transform"
          >
            <img
              src="/assets/music_list.svg"
              alt="music list"
              className="w-6 h-6 md:mx-1"
            />
            <span className="hidden md:inline-flex md:px-1 md:flex-shrink">
              {t("createRadioList")}
            </span>
          </Link>
          <Link to="/profile" className="bg-blue-600/20 md:p-2 rounded-full">
            <PersonIcon className="w-6 h-6 text-white" />
          </Link>
          
          <div className="hidden md:flex relative">
            <button 
              className="flex gap-1 items-center space-x-1 hover:bg-blue-600/20 py-1 px-3 rounded-full" 
              onClick={toggleLanguageMenu}
            >
              <span className="uppercase">{locale}</span>
              <ChevronDownIcon 
                className={`w-5 h-5 transition-transform duration-300 ${showLanguageMenu ? 'rotate-180' : ''}`} 
              />
            </button>
            
            <div 
              className={`absolute right-0 mt-12 bg-white text-blue-800 rounded-[0.875rem] shadow-lg py-1 min-w-[13.625rem] transition-all duration-300 origin-top ${
                showLanguageMenu 
                  ? 'opacity-100 scale-100 animate-accordion-down' 
                  : 'opacity-0 scale-95 pointer-events-none animate-accordion-up'
              }`}
            >
              {i18n.supportedLngs.map((lang) => (
                <Link
                  key={lang}
                  to={generateLocalizedRoute(lang, location.pathname.substring(3))}
                  className=" px-4 py-2 hover:bg-blue-100 hover:rounded-full text-sm flex items-center justify-between"
                  onClick={() => setShowLanguageMenu(false)}
                >
                  <span className="uppercase">{lang}</span>
                  {locale === lang && (
                    <CheckIcon className="w-4 h-4"/>
                  )}
                </Link>
              ))}
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
}