import { Link, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import {
  LightningBoltIcon,
  GlobeIcon,
  PersonIcon,
  ChevronDownIcon,
  CheckIcon,
  MagnifyingGlassIcon
} from "@radix-ui/react-icons";
import { generateLocalizedRoute } from "../utils/generate-route";
import { CreateNewListMenu } from "./pop-ups/create-new-list-menu";
import { useState, useRef, useEffect } from "react";
import i18n from "../i18n";
import { ProfileDropdownMenu } from "./pop-ups/profile-dropdown-menu";

export default function Header({ locale, alwaysBlue = false, searchBarStatic = true }) {
  const { t } = useTranslation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const defaultLang = i18n.fallbackLng;
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const [showCreateListMenu, setShowCreateListMenu] = useState(false);
  const [createListMenuExiting, setCreateListMenuExiting] = useState(false);
  
  useEffect(() => {
    if (createListMenuExiting) {
      const timeout = setTimeout(() => {
        setShowCreateListMenu(false);
        setCreateListMenuExiting(false);
      }, 300); // match your fadeOut duration
      return () => clearTimeout(timeout);
    }
  }, [createListMenuExiting]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchInputRef.current && 
          !searchInputRef.current.contains(event.target) && 
          !searchBarStatic && 
          searchExpanded && 
          !searchValue) {
        setSearchExpanded(false);
      }

      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchBarStatic, searchExpanded, searchValue]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
        if (!searchBarStatic) {
          setSearchExpanded(true);
        }
      } else {
        setScrolled(false);
        if (!searchBarStatic && !searchValue) {
          setSearchExpanded(false);
        }
      }
    };
    
    if (!alwaysBlue) {
      window.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [alwaysBlue, searchBarStatic, searchValue]);
  
  const toggleLanguageMenu = () => {
    setShowLanguageMenu(!showLanguageMenu);
  };

  return (
    <div className={`fixed w-full h-16 left-0 right-0 z-50 ${alwaysBlue || scrolled ? 'bg-[#167AFE]' : 'bg-transparent'} text-white py-4 px-8 flex items-center`}>
      <div className="flex md:justify-between items-center w-full">
        <div className="flex items-center md:space-x-6">
          <div className="flex items-center">
            <Link to={generateLocalizedRoute(locale, "/")} className="hover:scale-105 transition-all">
              <img
                src="/assets/radio_pronto_icon.svg"
                alt="Radio Pronto"
                className="md:mr-2 w-3/4 h-3/4 md:w-full md:h-full"
              />
            </Link>
          </div>
          <div className="flex items-center -ml-4 md:-ml-0 space-x-2 md:space-x-4">

            <div className={`flex flex-col items-center group relative ${location.pathname === `/${locale}/genres` ? 'text-[#E6E953]' : 'text-white hover:text-[#E6E953]'}`}>
              <Link
                to={generateLocalizedRoute(locale, "/genres")}
                className="flex items-center"
              >
                <LightningBoltIcon className="w-6 h-6 mr-1" />
                <span className="hidden md:flex font-inter text-base/[1.375rem]">
                  {t("genres")}
                </span>
              </Link>
              <div className="absolute bottom-[-8px] w-0 h-[2px] bg-[#E6E953] group-hover:w-full transition-all duration-300 origin-center"></div>
            </div>

            <div className={`flex flex-col items-center group relative ${location.pathname === `/${locale}/countries` ? 'text-[#E6E953]' : 'text-white hover:text-[#E6E953]'}`}>
              <Link
                to={generateLocalizedRoute(locale, "/countries")}
                className="flex items-center"
              >
                <GlobeIcon className="w-6 h-6 mr-1" />
                <span className="hidden md:flex font-inter text-base/[1.375rem]">
                  {t("countries")}
                </span>
              </Link>
              <div className="absolute bottom-[-8px] w-0 h-[2px] bg-[#E6E953] group-hover:w-full transition-all duration-300 origin-center"></div>
            </div>
          </div>
        </div>

        <div className="flex md:ml-0 ml-4 items-center gap-2">

          <button
            onClick={() => {
              setShowCreateListMenu(true);
              setCreateListMenuExiting(false);
            }}
            className="bg-[#E6E953] text-black whitespace-nowrap md:h-[2.5rem] md:min-w-[8rem] md:max-w-[12.0625rem] ml-2 px-2 py-1 rounded-full flex font-jakarta items-center justify-center
              font-semibold text-[0.875rem]/[1.375rem] transform transition-transform duration-300 hover:scale-105"
          >
            <img
              src="/assets/music_list.svg"
              alt="music list"
              className="w-6 h-6 md:mx-1"
            />
            <span className="hidden md:inline-flex md:px-1 md:flex-shrink">
              {t("createRadioList")}
            </span>
          </button>
          
          {searchBarStatic ? (
            <div className="relative ml-1 w-[21.125rem] h-12 hidden md:block "> 

              <div className="flex pointer-events-none">
                <div className="flex items-center justify-center  flex-row w-full text-center px-4  h-12
                text-white rounded-xl bg-white/25 font-jakarta font-normal text-sm/[1.375rem]">
                  <MagnifyingGlassIcon className="w-6 h-6 text-white mr-2" />
                  <span className="text-white">{t("searchBarTitle")}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative md:flex h-12 items-center hidden">
              <div 
                className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
                  searchExpanded || scrolled ? 'w-[21.125rem] opacity-100' : 'w-0 opacity-0'
                }`}
              >
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="w-5 h-5 text-white" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={t("searchBarTitle")}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className={`flex flex-row w-full ${!searchValue ? 'text-center' : 'text-left pl-10'} px-4 h-12 
                    text-white placeholder-white rounded-xl focus:outline-none bg-white/25 font-jakarta font-normal text-sm/[1.375rem]`}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              className="bg-blue-600/20 md:p-2 hover:scale-110 transition-all rounded-full flex items-center justify-center"
              onClick={() => setShowProfileMenu((prev) => !prev)}
            >
              <PersonIcon className="w-6 h-6 text-white" />
            </button>
            <div
              className={`
                absolute -right-20 mt-4 z-50
                transition-opacity duration-300
                ${showProfileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
              `}
            >
              <ProfileDropdownMenu locale={locale} />
            </div>
          </div>
          
          <div ref={dropdownRef} className="hidden md:flex relative">
            <button 
              className="flex gap-1 items-center space-x-1 hover:bg-blue-600/20 transition-all py-1 px-3 rounded-full" 
              onClick={toggleLanguageMenu}
            >
              <span className="uppercase font-jakarta font-semibold text-sm/[1.375rem]">{locale || defaultLang}</span>
              <ChevronDownIcon 
                className={`w-5 h-5 transition-transform duration-300 ${showLanguageMenu ? 'rotate-180' : ''}`} 
              />
            </button>
            
            <div 
              className={`absolute right-2 mt-12 bg-white text-blue-800 rounded-[0.875rem] shadow-lg py-1 min-w-[13.625rem] transition-all duration-300 origin-top ${
                showLanguageMenu 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              {i18n.supportedLngs.map((lang) => (
                <a
                  key={lang}
                  href={generateLocalizedRoute(lang, location.pathname.substring(3))}
                  className="px-4 py-2 hover:bg-blue-100 text-sm flex items-center justify-between transition-all duration-300 ease-in-out transform hover:scale-102 mx-1 my-0.5 rounded-lg hover:rounded-lg"
                  onClick={() => setShowLanguageMenu(false)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 transition-transform duration-300 hover:rotate-12">
                      <img 
                        src={`/assets/flags/${lang === 'en' ? 'gb' : lang}.svg`} 
                        alt={`${lang} flag`} 
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <span className={`uppercase font-jakarta font-medium text-sm/[1.375rem] transition-colors duration-300 hover:text-blue-600 ${locale === lang ? 'text-[#167AFE]' : 'text-[#00192C]'}`}>
                      {lang}
                    </span>
                  </div>
                  {locale === lang && (
                    <CheckIcon className="w-6 h-6 transition-all duration-300 text-[#167AFE]"/>
                  )}
                </a>
              ))}
            </div>
          
          </div>
        </div>
      </div>
      {showCreateListMenu && (
          <>
            <div
              className={`fixed inset-0 bg-black bg-opacity-60 z-50 transition-opacity duration-300 ${createListMenuExiting ? "animate-fade-out" : "animate-fade-in"}`}
              onClick={() => setCreateListMenuExiting(true)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className={`pointer-events-auto ${createListMenuExiting ? "animate-fade-out" : "animate-fade-in"}`}>
                <CreateNewListMenu
                  onClose={() => setCreateListMenuExiting(true)}
                />
              </div>
            </div>
          </>
        )}
    </div>
  );
}