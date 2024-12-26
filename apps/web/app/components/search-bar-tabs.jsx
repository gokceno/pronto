import SearchBar from "./search-bar.jsx";
import { useTranslation } from 'react-i18next';

export default function SearchBarTabs() {
    const { t } = useTranslation();

    return (
        <div className="bg-gradient min-h-[400px] py-20">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-white text-3xl font-bold mb-8">
            {t('searchHeader')}
          </h1>
          <SearchBar />
          <div className="flex justify-center space-x-2 mt-6">
            {["Pop", "R&B", "Indie", "Metal", "Country", "Rock", "Hits", "Dance"].map((genre) => (
              <button
                key={genre}
                className="px-4 py-1 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
}
