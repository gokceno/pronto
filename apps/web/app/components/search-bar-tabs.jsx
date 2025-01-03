import { useTranslation } from 'react-i18next';
import { Link } from "@remix-run/react";

export default function SearchBarTabs() {

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
        <Link
          key={genre}
          to={`/genre/${genre.toLowerCase()}`}
          className="px-4 py-1 rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          {genre}
        </Link>
      ))}
    </div>
    );
}
