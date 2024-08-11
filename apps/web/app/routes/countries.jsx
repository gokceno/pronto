import { Outlet, Link, useLoaderData, useMatches } from "@remix-run/react";
import { json } from "@remix-run/node";
import Truncate from "../components/truncate.jsx";

export const loader = async () => {
  const response = await fetch(
    "http://de1.api.radio-browser.info/json/countries?order=stationcount&limit=30&reverse=true",
    {
      headers: {
        "User-Agent": "Radio Pronto/1.0 (radiopronto.net)",
      },
    },
  );
  return json({
    countries: await response.json(),
  });
};

export default function Index() {
  const { countries } = useLoaderData();
  const matches = useMatches();
  const country = matches.filter((m) => m.id === "root")[0]?.params?.country;
  return (
    <div className="container flex">
      <div className="w-[20%] ml-4">
        <ul className="space-y-0.5">
          {countries.map(({ name, iso_3166_1 }) => (
            <li key={iso_3166_1}>
              <Link
                to={iso_3166_1.toLowerCase()}
                className={
                  country == iso_3166_1.toLowerCase()
                    ? "text-white bg-blue-800 font-mono text-sm px-2 py-0.5 rounded"
                    : "text-blue-600 hover:bg-green-400 font-mono text-sm px-2 py-0.5 rounded"
                }
              >
                <Truncate>{name}</Truncate>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Outlet />
    </div>
  );
}
