import { Link } from "@remix-run/react";
import { useMatches } from "@remix-run/react";
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export default function SearchBar() {
    const { t } = useTranslation();

    return (   
      <div className="max-w-3xl mx-auto text-center px-4">
        <h1 className="text-white text-3xl font-bold mb-8">
          {t("searchHeader")}
        </h1>
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t("searchBarTitle")}
              className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none"
            />
          </div>
          <Link to="/stations" className="bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center">
          <img src="/assets/equalizer.svg" alt="eq" className="mr-2"/>
            {t("stations")}
          </Link>
        </div>
      </div>
    );
}
