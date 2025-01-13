import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { PlayerProvider } from "../contexts/player";
import { DotFilledIcon } from "@radix-ui/react-icons";
import Pagination from "../components/pagination.jsx";
import RadioCard from "../components/radio-card.jsx";
import { description as generateDescription } from "../description.js";
import { RadioBrowserApi, StationSearchType } from 'radio-browser-api'

export const loader = async ({ params, request }) => {
  const { id: genre } = params;
  const url = new URL(request.url);
  const api = new RadioBrowserApi(process.env.APP_TITLE);
  const currentPage = parseInt(url.searchParams.get("p")) || 1;
  const description = await generateDescription({
    input: genre,
    type: "genre",
  });
  const recordsPerPage = 12;
  const offset = (currentPage - 1) * recordsPerPage;

  try {
    const tag = await api.getTags(genre)

    const genreTagInfo = tag.filter(
      (tag) => tag.name.toLowerCase() === genre.toLowerCase(),
    );
    console.log(genreTagInfo);
    const totalRecords = genreTagInfo[0]?.stationcount || 0;

    const stations = await api.getStationsBy(StationSearchType.byTag, genre, {
      order: "clickcount",
      reverse: true,
      offset,
      limit: recordsPerPage,
    });
    return json({
      genre,
      stations,
      description,
      stationCount: totalRecords,
      currentPage,
      totalRecords,
      recordsPerPage,
    });
  } catch (error) {
    console.error("Error in genre details loader:", error);
    return json({
      genre,
      stations: [],
      description: null,
      stationCount: 0,
      currentPage: 1,
      totalRecords: 0,
      recordsPerPage,
    });
  }
};

export default function GenreDetails() {
  const {
    genre,
    stations,
    stationCount,
    description,
    currentPage,
    totalRecords,
    recordsPerPage,
  } = useLoaderData();
  const { t } = useTranslation();

  return (
    <PlayerProvider>
      <div className="bg-blue-900">
        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto px-4 sm:px-8 lg:px-20 py-8 sm:py-10 lg:py-14 text-white">
            <div className="flex flex-col lg:flex-row lg:gap-60 gap-8">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold capitalize mb-2">
                  {genre}
                </h1>
                <div className="flex items-center gap-2 mb-4 sm:mb-6 lg:mb-8">
                  <div className="flex items-center">
                    <span>{stationCount}</span>
                    <span className="ml-1">{t("genreStations")}</span>
                  </div>
                  <span className="text-xl sm:text-2xl">
                    <DotFilledIcon />
                  </span>
                  <div className="flex items-center">
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 lg:max-w-2xl">
                <p className="text-white/80">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-20 py-8">
          <h2 className="text-lg font-medium mb-6">{t("allStations")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stations.map(
              ({
                stationuuid,
                name,
                tags,
                clickCount,
                votes,
                language,
                url,
                country,
              }) => (
                <RadioCard
                  key={`${stationuuid}`}
                  stationuuid={stationuuid}
                  name={name}
                  tags={tags || []}
                  clickcount={clickCount}
                  votes={votes}
                  language={language}
                  url={url}
                  country={country}
                />
              ),
            )}
          </div>
          <div className="mt-12 flex justify-center">
            <Pagination
              totalRecords={totalRecords}
              recordsPerPage={recordsPerPage}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </PlayerProvider>
  );
}
