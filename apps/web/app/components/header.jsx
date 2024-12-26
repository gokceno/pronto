
import { Link } from "@remix-run/react";
import { useTranslation } from 'react-i18next';

export default function Header() {
    const { t } = useTranslation();
  return (
    <header>
        <header className="bg-blue-800 text-white py-4 px-6 shadow-md flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <img src="/assets/pronto_radio_icon.png" alt="Pronto Radio" className="h-8 mr-2" />
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                {t('homePage')}
              </Link>
              <Link to="/turler" className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 8a2 2 0 11-4 0 2 2 0 014 0zM18 14a4 4 0 00-8 0" />
                </svg>
                {t('genres')}
              </Link>
              <Link to="/dunyadan" className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                {t('countries')}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-yellow-400 text-black px-4 py-2 rounded-full flex items-center font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('createRadioList')}
            </button>
            <button className="bg-blue-600/20 p-2 rounded-full">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </button>
          </div>
        </header>
    </header>
  );
  
}
