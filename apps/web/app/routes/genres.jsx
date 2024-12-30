import { useLoaderData, useMatches } from "@remix-run/react";
import { json } from "@remix-run/node";
import Truncate from "../components/truncate.jsx";
import { useTranslation } from 'react-i18next';
import { GenreCard } from "../components/genre-card.jsx";
import { AllOptionsContainer } from "../components/all-options-container.jsx";

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
  const { t } = useTranslation();
  const { genres } = useLoaderData();
  const matches = useMatches();
  const genre = matches.filter((m) => m.id === "root")[0]?.params?.genre;
  return (
    <AllOptionsContainer type="genres">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
      {genres.map(({ id, name, stationcount }) => (
        <GenreCard 
          key={`${id}`}
          id={id}
          name={name}
          stationcount={stationcount}
        />
      ))}
      </div>
    </AllOptionsContainer>
    );
}
