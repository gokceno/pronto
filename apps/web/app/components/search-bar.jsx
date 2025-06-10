import { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { generateLocalizedRoute } from "../utils/generate-route";
import SearchSuggestions from "../components/search-suggestions";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ locale, expandable = false, stations, stationList }) {
  const { t } = useTranslation();
  const [showHoverBox, setShowHoverBox] = useState(false);
  const hasClosedHoverBoxOnInput = useRef(false);
  const [hoverBoxAnimation, setHoverBoxAnimation] = useState("");
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const hoverBoxRef = useRef(null);
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState({ radios: [], genres: [], countries: [] });
  const [loading, setLoading] = useState(false);
  const addToLatestSearches = (value) => {
    let latest = JSON.parse(localStorage.getItem("latestSearches") || "[]");
    latest = [value, ...latest.filter((v) => v.toLowerCase() !== value.toLowerCase())].slice(0, 5);
    localStorage.setItem("latestSearches", JSON.stringify(latest));
  };
  const handleSearch = () => {
    const value = inputValue.trim();
    if (value !== "") {
      addToLatestSearches(value);
      if (searchResults.radios && searchResults.radios.length > 0) {
        navigate(generateLocalizedRoute(locale, `/details/station/${searchResults.radios[0].id}`));
        return;
      }
      if (searchResults.genres && searchResults.genres.length > 0) {
        navigate(generateLocalizedRoute(locale, `/details/genre/${searchResults.genres[0]}`));
        return;
      }
      if (searchResults.countries && searchResults.countries.length > 0) {
        navigate(generateLocalizedRoute(locale, `/details/country/${searchResults.countries[0].iso}`));
        return;
      }
    }
    const route = value === ""
      ? generateLocalizedRoute(locale, "/search")
      : generateLocalizedRoute(locale, `/search?q=${encodeURIComponent(value)}`);
    navigate(route);
  };

  useEffect(() => {
    if (!inputValue) {
      setSearchResults({ radios: [], genres: [], countries: [] });
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(inputValue)}`, { signal: controller.signal })
      .then(res => res.json())
      .then(setSearchResults)
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [inputValue]);

  useEffect(() => {
    if (inputValue && showHoverBox && !hasClosedHoverBoxOnInput.current) {
      setShowHoverBox(false);
      setHoverBoxAnimation("");
      hasClosedHoverBoxOnInput.current = true;
    }
    if (!inputValue) {
      hasClosedHoverBoxOnInput.current = false;
    }
  }, [inputValue, showHoverBox]);

  useEffect(() => {
    if (showHoverBox) {
      setHoverBoxAnimation("animate-hoverbox-slide-down");
    } else if (hoverBoxAnimation) {
      setHoverBoxAnimation("animate-hoverbox-slide-up");
    }
  }, [showHoverBox]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        hoverBoxRef.current &&
        !hoverBoxRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowHoverBox(false);
      }
    }
    if (showHoverBox) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHoverBox]);

  return (
    <div className="w-full  h-[14.5rem] mx-auto gap-8 flex flex-col items-center text-center border-2 border-[#167AFE] rounded-xl relative">
      <div className="flex w-full h-full items-center gap-2 bg-white rounded-lg px-2 mx-auto">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </div>
            <input
              ref={inputRef}
              type="text"
              placeholder={t("searchBarTitle")}
              className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none"
              id="search-input"
              value={inputValue}
              onFocus={() => setShowHoverBox(true)}
              onChange={e => {
                setInputValue(e.target.value);
                if (e.target.value === "") {
                  setShowHoverBox(true);
                }
              }}
              autoComplete="off"
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
        </div>
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 transition-all text-white px-6 py-2 rounded-lg flex items-center group"
          onClick={handleSearch}
        >
          <img src="/assets/equalizer.svg" alt="eq" className="mr-2" />
          <span>{t("stations")}</span>
          <span className="w-0 overflow-hidden group-hover:w-5 transition-all duration-300 ease-in-out">
            <ArrowRightIcon className="ml-1 mt-0.5 w-4 h-4" />
          </span>
        </button>
      </div>
      {inputValue && (
        <div className="absolute top-[4.5rem] left-0 w-full bg-white border shadow-xl rounded-lg z-40 p-6 gap-10">
          <div className="w-full flex flex-col gap-4 items-start justify-start">
            <div className="w-full flex gap-4">
              <span className="font-jakarta text-[1rem]/[1.5rem] font-bold text-[#00192C]">
                {t("searchResults")}
              </span>
            </div>

            <div className="w-full flex flex-col gap-4 items-start justify-start">
              <div className="flex w-full flex-col items-start justify-start">
                <span className="font-jakarta text-[0.875rem]/[1.375rem] font-semibold text-[#00192C] mb-2 underline">{t("radios")}</span>
                {searchResults.radios && searchResults.radios.length > 0 ? (
                  searchResults.radios.slice(0, 5).map(r => (
                    <div
                      key={r.id}
                      className="py-1 w-full rounded items-start justify-start flex hover:bg-gray-100 transition-all cursor-pointer text-center"
                      onClick={() => {
                        addToLatestSearches(r.name);
                        navigate(generateLocalizedRoute(locale, `/details/station/${r.id}`));
                      }}
                    >
                      <span className="capitalize font-jakarta text-[0.875rem]/[1.375rem] font-normal text-[#02141C] line-clamp-1">{r.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">{t("noResults")}</div>
                )}
              </div>
              <div className="flex w-full flex-col items-start justify-start">
              <span className="font-jakarta text-[0.875rem]/[1.375rem] font-semibold text-[#00192C] mb-2 underline">{t("genres")}</span>
                {searchResults.genres && searchResults.genres.length > 0 ? (
                  searchResults.genres.slice(0, 5).map(g => (
                    <div key={g} className="py-1 w-full rounded items-start justify-start flex hover:bg-gray-100 transition-all cursor-pointer"
                        onClick={() => {
                          addToLatestSearches(g);
                          navigate(generateLocalizedRoute(locale, `/details/genre/${g}`));
                        }}>
                      <span className="capitalize font-jakarta text-[0.875rem]/[1.375rem] font-normal text-[#02141C] line-clamp-1">{g}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">{t("noResults")}</div>
                )}
              </div>
              <div className="flex w-full flex-col items-start justify-start">
              <span className="font-jakarta text-[0.875rem]/[1.375rem] font-semibold text-[#00192C] mb-2 underline">{t("countries")}</span>
                {searchResults.countries && searchResults.countries.length > 0 ? (
                  searchResults.countries.slice(0, 5).map(c => (
                    <div key={c.id} className="py-1 w-full rounded items-start justify-start flex hover:bg-gray-100 transition-all cursor-pointer"
                        onClick={() => {
                          addToLatestSearches(c.name);
                          navigate(generateLocalizedRoute(locale, `/details/country/${c.iso}`));
                        }}>
                      <span className="capitalize font-jakarta text-[0.875rem]/[1.375rem] font-normal text-[#02141C] line-clamp-1">{c.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">{t("noResults")}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      { (showHoverBox || hoverBoxAnimation === "animate-hoverbox-slide-up") && expandable && (
        <div
          ref={hoverBoxRef}
          className={`absolute mt-[4.5rem] z-30 bg-white rounded-xl shadow-2xl 
            transition-all duration-200 flex
            w-[61.0625rem] min-w-[18.75rem] max-w-[98vw] min-h-[12.5rem] max-h-[90vh]
            ${hoverBoxAnimation}`}
          onAnimationEnd={() => {
            if (hoverBoxAnimation === "animate-hoverbox-slide-up") {
              setHoverBoxAnimation("");
            }
          }}
        >
          <SearchSuggestions
            t={t}
            locale={locale}
            stations={stations}
            stationList={stationList}
            main={true}
          />
        </div>
        )}
    </div>
  );
}
