import { Link } from "@remix-run/react";
import { generateLocalizedRoute } from "../utils/generate-route";

export default function SearchBarTabs({ locale, genres = [] }) {
  return (
    <div className="hidden md:flex justify-center gap-2">
      {genres.slice(0, 8).map((genre) => (
        <Link
          key={genre.name}
          to={generateLocalizedRoute(
            locale,
            `/details/genre/${encodeURIComponent(genre.name)}`,
          )}
          className="px-4 py-1 rounded-lg bg-white/25 text-white justify-center items-center transition-all hover:scale-105"
        >
          <span className="font-semibold font-jakarta text-sm/[1.375rem] capitalize">
            {genre.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
