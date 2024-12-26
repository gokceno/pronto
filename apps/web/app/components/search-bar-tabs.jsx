import SearchBar from "./search-bar.jsx";
import { useTranslation } from 'react-i18next';

export default function SearchBarTabs() {
    const { t } = useTranslation();

    return (
      <div className="flex justify-center space-x-2 mt-6">
      {[
        "Pop",
        "R&B",
        "Indie",
        "Metal",
        "Country",
        "Rock",
        "Hits",
        "Dance",
      ].map((genre) => (
        <button
          key={genre}
          className="px-4 py-1 rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          {genre}
        </button>
      ))}
    </div>
    );
}
