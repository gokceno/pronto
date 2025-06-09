import { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { generateLocalizedRoute } from "../utils/generate-route";
import SearchSuggestions from "../components/search-suggestions";

export default function SearchBar({ locale, expandable = false, stations, stationList }) {
  const { t } = useTranslation();
  const [showHoverBox, setShowHoverBox] = useState(false);
  const hasClosedHoverBoxOnInput = useRef(false);
  const [hoverBoxAnimation, setHoverBoxAnimation] = useState("");
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const hoverBoxRef = useRef(null);

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
          />
        </div>
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 transition-all text-white px-6 py-2 rounded-lg flex items-center group"
          onClick={() => {
            const value = inputValue.trim();
            let route;
            if (value === "") {
              route = generateLocalizedRoute(locale, "/search");
            } else {
              route = generateLocalizedRoute(locale, `/search?q=${encodeURIComponent(value)}`);
            }
            window.location.href = route;
          }}
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
          <div classname="w-full flex flex-col gap-12 items-start justify-start">
            <div className="w-full flex gap-12">
              <span className="font-jakarta text-[1rem]/[1.5rem] font-bold text-[#00192C]">
                {t("searchResults")}
              </span>
            </div>

            {/*RESULSTS*/}
            <div className="w-full flex flex-col gap-4">
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
