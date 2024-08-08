import { Outlet, Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import Truncate from "../components/truncate.jsx";

export const loader = async () => {
  const response = await fetch(
    "http://de1.api.radio-browser.info/json/tags?order=stationcount&limit=20&reverse=true",
    {
      headers: {
        "User-Agent": "Radio Pronto/1.0 (radiopronto.net)",
      },
    },
  );

  return json({
    genres: await response.json(),
  });
};

export default function Index() {
  const { genres } = useLoaderData();
  return (
    <div className="container flex">
      <div className="w-[20%] ml-4">
        <ul className="space-y-0.5">
          {genres.map(({ name, stationcount }) => (
            <li key={name}>
              <Link
                to={name}
                className="text-blue-600 font-mono text-sm hover:bg-green-400 px-2 py-0.5 rounded"
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
