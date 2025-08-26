import { Link, useLocation, useFetcher } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import {
  LightningBoltIcon,
  GlobeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CheckIcon,
  Cross1Icon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { generateLocalizedRoute } from "../utils/generate-route";
import { CreateNewListMenu } from "./pop-ups/create-new-list-menu";
import { useState, useRef, useEffect } from "react";
import i18n from "../i18n";
import { ProfileDropdownMenu } from "./pop-ups/profile-dropdown-menu";
import SearchBar from "./search-bar";
import SearchSuggestions from "./search-suggestions";
import UserInitials from "./user-initials";
export default function Header({
  locale,
  alwaysBlue = false,
  showSearch = true,
  user,
  isStatic = true,
}) {
  const { t } = useTranslation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const defaultLang = i18n.fallbackLng;
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const [showCreateListMenu, setShowCreateListMenu] = useState(false);
  const [createListMenuExiting, setCreateListMenuExiting] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchDropdownExiting, setSearchDropdownExiting] = useState(false);
  const searchDropdownRef = useRef(null);
  const fetcher = useFetcher();

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
    if (showCreateListMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCreateListMenu]);

  useEffect(() => {
    if (searchDropdownExiting) {
      const timeout = setTimeout(() => {
        setShowSearchDropdown(false);
        setSearchDropdownExiting(false);
      }, 300); // match your fadeOut duration
      return () => clearTimeout(timeout);
    }
  }, [searchDropdownExiting]);

  // Prevent background scrolling when search dropdown is open
  useEffect(() => {
    if (showSearchDropdown) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showSearchDropdown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Use setTimeout to give modals a chance to handle events first
      setTimeout(() => {
        // Re-check if modal is still active after other handlers have run
        if (document.querySelector('[role="dialog"][aria-modal="true"]')) {
          return;
        }

        // Check if click is within any modal or backdrop
        if (
          event.target.closest('[role="dialog"]') ||
          event.target.closest('[aria-modal="true"]') ||
          event.target.closest(".fixed.inset-0.bg-black") ||
          event.target.hasAttribute("data-modal-backdrop")
        ) {
          return;
        }

        if (
          searchDropdownRef.current &&
          !searchDropdownRef.current.contains(event.target)
        ) {
          if (showSearchDropdown) {
            setSearchDropdownExiting(true);
          }
        }

        if (
          profileMenuRef.current &&
          !profileMenuRef.current.contains(event.target)
        ) {
          if (showProfileMenu) {
            setShowProfileMenu(false);
          }
        }
      }, 0);
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && showSearchDropdown) {
        setSearchDropdownExiting(true);
      }
      if (event.key === "Escape" && showProfileMenu) {
        setShowProfileMenu(false);
      }
    };

    if (showSearchDropdown || showProfileMenu) {
      // Use regular phase with timeout to give modals priority
      document.addEventListener("mousedown", handleClickOutside, false);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, false);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showSearchDropdown, showProfileMenu]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      }
      if (window.scrollY < 10) {
        setScrolled(false);
      }
    };

    if (!alwaysBlue) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [alwaysBlue]);

  const toggleLanguageMenu = () => {
    setShowLanguageMenu(!showLanguageMenu);
  };

  const toggleSearchDropdown = () => {
    if (showSearchDropdown) {
      setSearchDropdownExiting(true);
    } else {
      // Load search data when opening dropdown
      fetcher.load(`/${locale}/search`);
      setShowSearchDropdown(true);
      setSearchDropdownExiting(false);
    }
  };

  return (
    <div
      className={`fixed w-full h-16 left-0 right-0 z-[100] ${
        alwaysBlue || scrolled ? "bg-[#167AFE]" : "bg-transparent"
      } text-white py-4 px-8 flex items-center`}
    >
      <div className="flex md:justify-between items-center w-full">
        <div className="flex items-center md:space-x-6">
          <div className="flex items-center">
            <Link
              to={generateLocalizedRoute(locale, "/")}
              className="hover:scale-105 transition-all"
            >
              <img
                src="/assets/radio_pronto_icon.svg"
                alt="Radio Pronto"
                className="md:mr-2 w-3/4 h-3/4 md:w-full md:h-full"
              />
            </Link>
          </div>
          <div className="flex items-center -ml-4 md:-ml-0 space-x-2 md:space-x-4">
            <div
              className={`flex flex-col items-center group relative ${
                location.pathname === `/${locale}/genres`
                  ? "text-[#E6E953]"
                  : "text-white hover:text-[#E6E953]"
              }`}
            >
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

            <div
              className={`flex flex-col items-center group relative ${
                location.pathname === `/${locale}/countries`
                  ? "text-[#E6E953]"
                  : "text-white hover:text-[#E6E953]"
              }`}
            >
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
          {user && (
            <button
              data-create-list-btn
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
          )}

          <div
            className={`transition-all duration-500 ease-out ${
              (!isStatic || !showSearch) && !scrolled
                ? "w-0 opacity-0"
                : "w-10 opacity-100"
            }`}
          >
            <button
              onClick={toggleSearchDropdown}
              className="p-2 hover:scale-105 transition-all hover:bg-white/20 rounded-full flex items-center justify-center transform"
            >
              <MagnifyingGlassIcon className="w-6 h-6 text-white transition-all duration-300" />
            </button>
          </div>

          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              className="md:p-2 hover:scale-105 transition-all rounded-full flex items-center justify-center"
              onClick={() => setShowProfileMenu((prev) => !prev)}
            >
              {user ? (
                <UserInitials
                  userName={user.userName}
                  size="w-10 h-10"
                  className="hover:scale-110 transition-all"
                />
              ) : (
                <Link
                  to={generateLocalizedRoute(locale, "/login")}
                  className="bg-white text-[#167AFE] whitespace-nowrap md:h-[2.5rem] md:min-w-[8rem] md:max-w-[12.0625rem]
                    ml-2 px-2 py-1 rounded-full flex font-jakarta items-center justify-center
                    font-semibold text-[0.875rem]/[1.375rem] transform transition-transform duration-300 group relative overflow-hidden"
                >
                  <span
                    className={`
                      absolute left-4 flex items-center opacity-0 -translate-x-4 transition-all duration-300
                      group-hover:opacity-100 group-hover:translate-x-0
                    `}
                  >
                    <ChevronRightIcon className="w-4 h-4 font-semibold text-blue-500" />
                  </span>
                  <span
                    className={`
                      transition-all duration-300 ml-0 group-hover:ml-4
                    `}
                  >
                    {t("signIn")}
                  </span>
                </Link>
              )}
            </button>
            <div
              className={`
                absolute -right-20 mt-4 z-50
                transition-opacity duration-300
                ${
                  showProfileMenu
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }
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
              <span className="uppercase font-jakarta font-semibold text-sm/[1.375rem]">
                {locale || defaultLang}
              </span>
              <ChevronDownIcon
                className={`w-5 h-5 transition-transform duration-300 ${
                  showLanguageMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute right-2 mt-12 bg-white text-blue-800 rounded-[0.875rem] shadow-lg py-1 min-w-[13.625rem] transition-all duration-300 origin-top ${
                showLanguageMenu
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              {i18n.supportedLngs.map((lang) => (
                <a
                  key={lang}
                  href={generateLocalizedRoute(
                    lang,
                    location.pathname.substring(3),
                  )}
                  className="px-4 py-2 hover:bg-blue-100 text-sm flex items-center justify-between transition-all duration-300 ease-in-out transform hover:scale-102 mx-1 my-0.5 rounded-lg hover:rounded-lg"
                  onClick={() => setShowLanguageMenu(false)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 transition-transform duration-300 hover:rotate-12">
                      <img
                        src={`/assets/flags/${lang === "en" ? "gb" : lang}.svg`}
                        alt={`${lang} flag`}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <span
                      className={`uppercase font-jakarta font-medium text-sm/[1.375rem] transition-colors duration-300 hover:text-blue-600 ${
                        locale === lang ? "text-[#167AFE]" : "text-[#00192C]"
                      }`}
                    >
                      {lang}
                    </span>
                  </div>
                  {locale === lang && (
                    <CheckIcon className="w-6 h-6 transition-all duration-300 text-[#167AFE]" />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showCreateListMenu && (
        <CreateNewListMenu onClose={() => setCreateListMenuExiting(true)} />
      )}

      {showSearchDropdown && (
        <div
          ref={searchDropdownRef}
          className={`fixed top-16 left-0 right-0 z-50 bg-white shadow-lg overflow-y-auto ${
            searchDropdownExiting
              ? "animate-slide-out-right"
              : "animate-slide-in-right"
          }`}
          style={{
            minHeight: "60rem",
            maxHeight: "calc(100vh - 4rem)",
          }}
        >
          <div className="w-full min-h-[60rem] py-8 px-20 flex flex-col items-center justify-start relative">
            <button
              onClick={() => setSearchDropdownExiting(true)}
              className="absolute top-6 right-6 p-2 hover:scale-110 hover:border-[#167AFE] hover:border-[0.1rem] bg-gray-100 rounded-full transition-all"
            >
              <Cross1Icon className="w-5 h-5 text-[#167AFE]" />
            </button>

            <div className="w-[40rem] h-[10.5rem] gap-8 flex flex-col text-center">
              <div className="w-full h-20">
                <span className="font-jakarta text-[2rem] font-bold whitespace-pre-line text-black">
                  {t("listenWhat")}
                </span>
              </div>

              <SearchBar
                locale={locale}
                border={true}
                onNavigate={() => setSearchDropdownExiting(true)}
                user={user}
              />
            </div>

            {fetcher.data && (
              <SearchSuggestions
                t={t}
                locale={locale}
                stations={fetcher.data.stations}
                stationList={
                  fetcher.data.stations?.map(
                    ({ id, name, url, country, clickCount, votes }) => ({
                      id,
                      name,
                      url,
                      country,
                      clickCount: clickCount || 0,
                      votes: votes || 0,
                    }),
                  ) || []
                }
                onNavigate={() => setSearchDropdownExiting(true)}
                user={user}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
