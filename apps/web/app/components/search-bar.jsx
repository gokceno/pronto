import { Link } from "@remix-run/react";
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { generateLocalizedRoute } from "../utils/generate-route";

export default function SearchBar({locale}) {
    const { t } = useTranslation();

    return (   
      <div className="w-full h-[14.5rem] mx-auto gap-8 flex flex-col text-center border-2 border-[#167AFE] rounded-xl">
        <div className="flex w-full h-full items-center gap-2 bg-white rounded-lg px-2 mx-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t("searchBarTitle")}
              className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none"
              id="search-input"
            />
          </div>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 transition-all text-white px-6 py-2 rounded-lg flex items-center group"
            onClick={() => {
              const input = document.getElementById("search-input");
              const value = input ? input.value.trim() : "";
              let route;
              if (value === "") {
                route = generateLocalizedRoute(locale, "/search");
              } else {
                route = generateLocalizedRoute(locale, `/search?q=${encodeURIComponent(value)}`);
              }
              window.location.href = route;
            }}
          >
            <img src="/assets/equalizer.svg" alt="eq" className="mr-2"/>
            <span>{t("stations")}</span>
            <span className="w-0 overflow-hidden group-hover:w-5 transition-all duration-300 ease-in-out">
              <ArrowRightIcon className="ml-1 mt-0.5 w-4 h-4"/>
            </span>
          </button>
        </div>
      </div>
    );
}
