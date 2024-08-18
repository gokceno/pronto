import { json } from "@remix-run/node";
import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import RadioCard from "../components/radio-card.jsx";
import Pagination from "../components/pagination.jsx";
import SortController from "../components/sort-controller.jsx";

export const meta = () => [{ title: "Radio Stations in Pop • Radio Pronto!" }];

export const loader = async ({ params, request }) => {
  const { genre } = params;
  const page = new URL(request.url)?.searchParams?.get("p") || 0;
  const sort = new URL(request.url)?.searchParams?.get("s") || "name";
  // eslint-disable-next-line no-undef
  const recordsPerPage = process.env.NUM_OF_RADIOS_PER_PAGE || 21;
  const response = await fetch(
    // eslint-disable-next-line no-undef
    `${process.env.RB_API_BASE_URL}/json/stations/bytag/${genre}?hidebroken=true&limit=${recordsPerPage}&offset=${
      (page - 1) * 20
    }&reverse=${["clickcount", "votes"].includes(sort)}&order=${sort}`,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "User-Agent": process.env.APP_USER_AGENT || "",
      },
    },
  );
  return json({
    stations: await response.json(),
    genreCode: genre,
    recordsPerPage,
  });
};

export default function Index() {
  const { stations, genreCode, recordsPerPage } = useLoaderData();
  const { genres } = useRouteLoaderData("routes/genres");
  const [{ name: genreName, stationcount: genreStationCount }] = genres.filter(
    (g) => g.name === genreCode,
  );
  return (
    <div className="w-[65%] ml-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold capitalize">
          Radio Stations in {genreName} &bull; {genreStationCount}
        </h2>
        <SortController />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map(
          ({ stationuuid, name, tags, clickcount, votes, language }) => (
            <RadioCard
              key={stationuuid}
              stationuuid={stationuuid}
              name={name}
              tags={tags}
              clickcount={clickcount}
              votes={votes}
              language={language}
            />
          ),
        )}
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          totalRecords={genreStationCount}
          recordsPerPage={recordsPerPage}
        />
      </div>
    </div>
  );
}
