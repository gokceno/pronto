import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { generateLocalizedRoute } from "../utils/generate-route";
import { useNavigate } from "@remix-run/react";

export default function HeaderSearchBar({
  locale,
  searchBarStatic,
  expanded,
  setExpanded,
  scrolled,
  onInputChange,
}) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState({
    radios: [],
    genres: [],
    countries: [],
  });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const searchResultRef = useRef(null);
  const navigate = useNavigate();

  const addToLatestSearches = (value) => {
    let latest = JSON.parse(localStorage.getItem("latestSearches") || "[]");
    latest = [
      value,
      ...latest.filter((v) => v.toLowerCase() !== value.toLowerCase()),
    ].slice(0, 3);
    localStorage.setItem("latestSearches", JSON.stringify(latest));
  };

  const handleSearch = () => {
    const value = inputValue.trim();
    if (value !== "") {
      addToLatestSearches(value);
      if (searchResults.radios && searchResults.radios.length > 0) {
        navigate(
          generateLocalizedRoute(
            locale,
            `/details/station/${searchResults.radios[0].id}`
          )
        );
        return;
      }
      if (searchResults.genres && searchResults.genres.length > 0) {
        navigate(
          generateLocalizedRoute(
            locale,
            `/details/genre/${searchResults.genres[0]}`
          )
        );
        return;
      }
      if (searchResults.countries && searchResults.countries.length > 0) {
        navigate(
          generateLocalizedRoute(
            locale,
            `/details/country/${searchResults.countries[0].iso}`
          )
        );
        return;
      }
    }
    const route =
      value === ""
        ? generateLocalizedRoute(locale, "/search")
        : generateLocalizedRoute(
            locale,
            `/search?q=${encodeURIComponent(value)}`
          );
    navigate(route);
  };

  useEffect(() => {
    if (!inputValue) {
      setSearchResults({ radios: [], genres: [], countries: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    let timeoutId;

    const performSearch = async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(inputValue)}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Only update state if the request wasn't aborted
        if (!controller.signal.aborted) {
          setSearchResults(data);
        }
      } catch (err) {
        // Only log errors that aren't abort errors
        if (err.name !== "AbortError" && !controller.signal.aborted) {
          console.error("Search fetch failed:", err);
          setSearchResults({ radios: [], genres: [], countries: [] });
        }
      } finally {
        // Only update loading state if the request wasn't aborted
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    timeoutId = setTimeout(performSearch, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
      setLoading(false);
    };
  }, [inputValue]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchResultRef.current &&
        !searchResultRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
    }
    if (showSearchResults) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearchResults]);

  // Classes for container and animation
  const containerClass = searchBarStatic
    ? "relative ml-1 w-[21.125rem] h-12 hidden md:block bg-white/20 rounded-xl"
    : "relative md:flex h-12 items-center hidden bg-white/20 rounded-xl";

  const innerWrapperClass = searchBarStatic
    ? "flex items-center w-full h-12 text-white font-jakarta font-normal text-sm/[1.375rem]"
    : `flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
        expanded || scrolled || inputValue.trim()
          ? "w-[21.125rem] opacity-100"
          : "w-0 opacity-0"
      }`;

  const inputClass = `flex flex-row w-full ${
    !inputValue && searchBarStatic ? "text-center" : "text-center"
  } px-4 h-12 text-white placeholder-white focus:outline-none bg-transparent font-jakarta font-normal text-sm/[1.375rem]`;

  return (
    <div className={containerClass}>
      <div className={innerWrapperClass}>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="w-6 h-6 text-white mr-2" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder={t("searchBarTitle")}
            value={inputValue}
            onFocus={() => {
              setShowSearchResults(true);
              if (!searchBarStatic && setExpanded) setExpanded(true);
            }}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSearchResults(true);
              if (!searchBarStatic && setExpanded) setExpanded(true);
              if (onInputChange) onInputChange(e.target.value);
            }}
            className={inputClass}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
      </div>
      {inputValue && showSearchResults && (
        <div
          ref={searchResultRef}
          className={`absolute top-[3.2rem] left-0 ${
            searchBarStatic ? "w-full" : "w-[21.125rem]"
          } bg-white border shadow-xl rounded-lg z-40 p-4 gap-6`}
        >
          <div className="w-full flex flex-col gap-2 items-start justify-start">
            <div className="w-full flex gap-2">
              <span className="font-jakarta text-[1rem]/[1.5rem] font-bold text-[#00192C]">
                {t("searchResults")}
              </span>
            </div>
            <div className="w-full flex flex-col gap-2 items-start justify-start">
              <div className="flex w-full flex-col items-start justify-start">
                <span className="font-jakarta text-[0.875rem]/[1.375rem] font-semibold text-[#00192C] mb-1 underline">
                  {t("radios")}
                </span>
                {searchResults.radios && searchResults.radios.length > 0 ? (
                  searchResults.radios.slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      className="py-1 w-full rounded items-start justify-start flex hover:bg-gray-100 transition-all cursor-pointer text-center"
                      onClick={() => {
                        addToLatestSearches(r.name);
                        navigate(
                          generateLocalizedRoute(
                            locale,
                            `/details/station/${r.id}`
                          )
                        );
                      }}
                    >
                      <span className="capitalize font-jakarta text-[0.875rem]/[1.375rem] font-normal text-[#02141C] line-clamp-1">
                        {r.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">{t("noResults")}</div>
                )}
              </div>
              <div className="flex w-full flex-col items-start justify-start">
                <span className="font-jakarta text-[0.875rem]/[1.375rem] font-semibold text-[#00192C] mb-1 underline">
                  {t("genres")}
                </span>
                {searchResults.genres && searchResults.genres.length > 0 ? (
                  searchResults.genres.slice(0, 3).map((g) => (
                    <div
                      key={g}
                      className="py-1 w-full rounded items-start justify-start flex hover:bg-gray-100 transition-all cursor-pointer"
                      onClick={() => {
                        addToLatestSearches(g);
                        navigate(
                          generateLocalizedRoute(locale, `/details/genre/${g}`)
                        );
                      }}
                    >
                      <span className="capitalize font-jakarta text-[0.875rem]/[1.375rem] font-normal text-[#02141C] line-clamp-1">
                        {g}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">{t("noResults")}</div>
                )}
              </div>
              <div className="flex w-full flex-col items-start justify-start">
                <span className="font-jakarta text-[0.875rem]/[1.375rem] font-semibold text-[#00192C] mb-1 underline">
                  {t("countries")}
                </span>
                {searchResults.countries &&
                searchResults.countries.length > 0 ? (
                  searchResults.countries.slice(0, 3).map((c) => (
                    <div
                      key={c.id}
                      className="py-1 w-full rounded items-start justify-start flex hover:bg-gray-100 transition-all cursor-pointer"
                      onClick={() => {
                        addToLatestSearches(c.name);
                        navigate(
                          generateLocalizedRoute(
                            locale,
                            `/details/country/${c.iso}`
                          )
                        );
                      }}
                    >
                      <span className="capitalize font-jakarta text-[0.875rem]/[1.375rem] font-normal text-[#02141C] line-clamp-1">
                        {c.name}
                      </span>
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
    </div>
  );
}
