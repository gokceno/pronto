import { json } from "@remix-run/node";
import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import Pagination from "../components/pagination.jsx";
import SortController from "../components/sort-controller.jsx";
import RadioCard from "../components/radio-card.jsx";

export const meta = () => [
  { title: "Radio Stations in Turkey • Radio Pronto!" },
];

export const loader = async ({ params, request }) => {
  const { country } = params;
  const page = new URL(request.url)?.searchParams?.get("p") || 0;
  const sort = new URL(request.url)?.searchParams?.get("s") || "votes";
  // eslint-disable-next-line no-undef
  const recordsPerPage = process.env.NUM_OF_RADIOS_PER_PAGE || 21;
  const response = await fetch(
    // eslint-disable-next-line no-undef
    `${process.env.RB_API_BASE_URL}/json/stations/bycountrycodeexact/${country}?hidebroken=true&limit=${recordsPerPage}&offset=${
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
    countryCode: country,
    recordsPerPage,
    page,
  });
};

export default function Index() {
  const { stations, countryCode, recordsPerPage, page } = useLoaderData();
  const { countries } = useRouteLoaderData("routes/countries");
  const [{ name: countryName, stationcount: countryStationCount }] =
    countries.filter((c) => c.iso_3166_1.toLowerCase() === countryCode);

  return (
    <div className="w-[65%] ml-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold capitalize">
          Radio Stations in {countryName} &bull; {countryStationCount} Stations
        </h2>
        <SortController />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map(
          ({ stationuuid, name, tags, clickcount, votes, language, url, country }) => (
            <RadioCard
              key={stationuuid}
              stationuuid={stationuuid}
              name={name}
              tags={tags}
              clickcount={clickcount}
              votes={votes}
              language={language}
              url={url}
              country={country}
            />
          ),
        )}
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          totalRecords={countryStationCount}
          recordsPerPage={recordsPerPage}
          currentPage={page}
        />
      </div>
    </div>
  );
}
