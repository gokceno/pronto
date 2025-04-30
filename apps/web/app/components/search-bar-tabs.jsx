import { Link } from "@remix-run/react";
import { generateLocalizedRoute } from '../utils/generate-route';

export default function SearchBarTabs(locale) {

    return (
      <div className="hidden md:flex justify-center space-x-2 mt-6">
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
          to={generateLocalizedRoute(locale, `/details/genre/${encodeURIComponent(genre)}`)}
          className="px-4 py-1 rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          {genre}
        </Link>
      ))}
    </div>
    );
}
