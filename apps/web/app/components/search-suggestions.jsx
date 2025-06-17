// pronto/apps/web/app/components/search-suggestions.jsx
import { Link } from "@remix-run/react";
import { TrashIcon } from "@radix-ui/react-icons";
import StationCard from "./station-card";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";

export default function SearchSuggestions({
  locale,
  stations,
  stationList,
  main = false
}) {
  const [latestSearchs, setLatestSearchs] = useState([]);
  const [deletingSearches, setDeletingSearches] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("latestSearches") || "[]");
    setLatestSearchs(stored);
  }, []);

  useEffect(() => {
    const onStorage = () => {
      const stored = JSON.parse(localStorage.getItem("latestSearches") || "[]");
      setLatestSearchs(stored);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleDeleteSearch = (searchToDelete) => {
    setDeletingSearches((prev) => [...prev, searchToDelete]);
    setTimeout(() => {
      setLatestSearchs((prev) => {
        const updated = prev.filter((search) => search !== searchToDelete);
        localStorage.setItem("latestSearches", JSON.stringify(updated));
        return updated;
      });
      setDeletingSearches((prev) => prev.filter((search) => search !== searchToDelete));
    }, 300);
  };
  
  const handleDeleteAllSearches = () => {
    setDeletingSearches([...latestSearchs]);
    setTimeout(() => {
      setLatestSearchs([]);
      localStorage.setItem("latestSearches", JSON.stringify([]));
      setDeletingSearches([]);
    }, 300);
  };

  return (
    <div className={`w-full h-[26rem] ${main ? "md:px-6" : "md:px-[15rem]"} py-6 gap-10 flex flex-col justify-start`}>
      <div className="w-[39.5rem] min-h-[6rem] gap-3 flex flex-col">
        {/* Latest Searches */}
        <div className="w-full h-10 gap-3 flex flex-row items-center">
          <span className="font-jakarta text-[1rem]/[1.5rem] font-bold text-[#00192C]">
            {t("latestSearch")}
          </span>
          {latestSearchs.length > 0 && (
            <span
              className="font-jakarta text-sm/[1.375rem] mt-0.5 font-semibold text-[#167AFE] relative group cursor-pointer"
              onClick={handleDeleteAllSearches}
            >
              {t("deleteAll")}
              <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-[#167AFE] transition-all duration-300 group-hover:w-full"></span>
            </span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          {latestSearchs.length > 0 ? (
            latestSearchs.map((search, idx) => (
              <Link
                key={search}
                to={`/${locale}/details/genre/${encodeURIComponent(search)}`}
                className={`w-full h-[2rem] py-1 gap-1 flex flex-row items-center hover:bg-[#E8F2FF] hover:rounded-lg transition-all
                  ${deletingSearches.includes(search) ? "slide-out-right" : ""}`}
              >
                <TrashIcon
                  className="text-[#167AFE] w-6 h-6 hover:scale-110 hover:text-[#DB0A3C] transition-all"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteSearch(search);
                  }}
                />
                <div className="font-jakarta font-medium text-sm/[1.375rem] text-[#02141C]">
                  {search}
                </div>
              </Link>
            ))
          ) : (
            <div className="font-jakarta text-sm text-[#8C9195]">{t("noRecentSearches")}</div>
          )}
        </div>

        {/* Hot Tags */}
        <div className="w-[25.5rem] min-h-[2rem] gap-3 flex flex-col">
          <div className="w-full h-6 flex flex-row">
            <span className="font-jakarta font-bold text-[1rem]/[1.5rem] text-[#00192C]">
              {t("hotTags")}
            </span>
          </div>
          <div className="w-full flex flex-row h-[2rem] gap-2">
            {["Pop", "Jazz", "R&B", "Hip-Pop", "Dance", "Indie"].map((genre) => (
              <Link
                to={`/${locale}/details/genre/${encodeURIComponent(genre)}`}
                key={genre}
                className="min-w-[3.25rem] h-[2rem] px-1 justify-center items-center text-center rounded-lg border border-[#94C2FF] bg-white transition-all hover:scale-105 hover:bg-[#E8F2FF]"
              >
                <span className="font-jakarta font-semibold text-sm/[1.375rem] text-[#1057B4]">
                  {genre}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Hot Stations */}
        <div className="w-[60rem] gap-3 flex flex-col mt-10 sm:w-[39.5rem]">
          <div className="w-full h-6 flex flex-row">
            <span className="font-jakarta font-bold text-[1rem]/[1.5rem] text-[#00192C]">
              {t("hotStations")}
            </span>
          </div>
          <div className="w-full grid grid-cols-2 grid-rows-2 gap-6">
            {stations.map(
              (
                {
                  id,
                  name,
                  tags,
                  clickCount,
                  votes,
                  language,
                  url,
                  country,
                  favicon,
                },
                index
              ) => (
                <StationCard
                  key={id ? `station-${id}` : `station-index-${index}`}
                  stationuuid={id}
                  name={name}
                  tags={tags || []}
                  clickCount={clickCount}
                  votes={votes}
                  language={language}
                  url={url}
                  country={country}
                  locale={locale}
                  stationList={stationList}
                  favicon={favicon}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}