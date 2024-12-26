import { Link } from "@remix-run/react";
import { useMatches } from "@remix-run/react";
import { useTranslation } from 'react-i18next';

export default function SearchBar() {
    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={t('searchBarTitle')}
            className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none"
          />
        </div>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M8 3v18m4-12v12m4-16v16m4-10v10M4 7v10" />
          </svg>
        {t('stations')}
        </button>
        
      </div>
    );
}
