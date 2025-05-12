import { Link } from "@remix-run/react";
import { generateLocalizedRoute } from '../utils/generate-route';

export default function SearchBarTabs(locale) {

    return (
      <div className="hidden md:flex justify-center gap-2">
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
          className="px-4 py-1 rounded-lg bg-white/25 text-white justify-center items-center transition-all hover:scale-105"
        >
          <span className="font-semibold font-jakarta text-sm/[1.375rem]">{genre}</span>
        </Link>
      ))}
    </div>
    );
}
