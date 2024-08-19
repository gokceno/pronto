import {
  Outlet,
  Link,
  useLoaderData,
  useMatches,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import Truncate from "../components/truncate.jsx";

export const meta = () => [{ title: "Radio Stations by Genre • Radio Pronto!" }];

export const loader = async () => {
  // eslint-disable-next-line no-undef
  const recordsPerPage = process.env.NUM_OF_GENRES_PER_PAGE || 30;
  const response = await fetch(
    // eslint-disable-next-line no-undef
    `${process.env.RB_API_BASE_URL}/json/tags?order=stationcount&limit=${recordsPerPage}&reverse=true`,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "User-Agent": process.env.APP_USER_AGENT || "",
      },
    },
  );

  return json({
    genres: await response.json(),
  });
};

export default function Index() {
  const { genres } = useLoaderData();
  const matches = useMatches();
  const genre = matches.filter((m) => m.id === "root")[0]?.params?.genre;
  return (
    <div className="container flex">
      <div className="w-[20%] ml-4">
        <ul className="space-y-0.5">
          {genres.map(({ name }) => (
            <li key={name}>
              <Link
                to={name}
                title={name}
                className={
                  genre == name
                    ? "text-white bg-blue-800 font-mono text-sm px-2 py-0.5 rounded capitalize"
                    : "text-blue-600 hover:bg-green-400 font-mono text-sm px-2 py-0.5 rounded capitalize"
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
