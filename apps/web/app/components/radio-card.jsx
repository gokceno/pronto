import Truncate from "../components/truncate.jsx";
import { formatStationName, formatStationTag } from "../utils/helpers";
import { useTranslation } from "react-i18next";
import { HeartIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { generateLocalizedRoute } from "../utils/generate-route.jsx";
import PlayButton from "../utils/play-button.jsx";

const RadioCard = ({
  // eslint-disable-next-line react/prop-types
  stationuuid,
  // eslint-disable-next-line react/prop-types
  name,
  // eslint-disable-next-line react/prop-types
  tags,
  // eslint-disable-next-line react/prop-types
  clickcount,
  // eslint-disable-next-line react/prop-types
  votes,
  // eslint-disable-next-line react/prop-types
  url,
  // eslint-disable-next-line react/prop-types
  country,
  // eslint-disable-next-line react/prop-types
  locale,
  // eslint-disable-next-line react/prop-types
  stationList
}) => {
  const { t } = useTranslation();
  
  const genres = tags
      .slice(0, 6)
      .map((tag) => (
        <Link 
          key={`${stationuuid}-${tag}`}
          to={generateLocalizedRoute(locale, `/details/genre/${encodeURIComponent(tag)}`)}
          className="h-[1.6875rem] px-2 py-1 bg-blue-100 text-blue-800 hover:scale-105 transition-all rounded-lg font-bold text-xs capitalize"
        >
          {formatStationTag(tag)}
        </Link>
    ));

  return (
    //Main
    <div
      className={`flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden p-4 flex-shrink-0 justify-between gap-3 min-w-[18.875rem] min-h-[13.875rem]`}
    >
      {/* Title,likes, count */}
      <div className={`flex gap-2`}>
        <div
          className={`flex items-center flex-shrink-0 h-11 w-11 bg-gradient-to-tr from-[#5539B2] to-[#D4C7FD] rounded-full justify-center text-white text-xs font-semibold select-none capitalize	`}
        >
          {formatStationName(name)}
        </div>
        <div className={`flex flex-col`}>
          <div className={`text-base font-semibold text-gray-900`}>
            <Truncate>{name}</Truncate>
          </div>
          <div className={`text-xs text-[#00192CA3]/[0.64]`}>
            {clickcount} {t("listeningCount")} • {votes} {t("likes")}
          </div>
        </div>
      </div>

      {/* Tag */}
      <div className="h-[3.75rem] ml-0.5 flex flex-wrap gap-1.5 select-none justify-start">
        {genres}
      </div>
      {/* Play, like, context */}
      <div className={`flex justify-between mt-3`}>
        <div className={`flex items-center`}>
          <PlayButton
            stationId={stationuuid}
            name={name}
            url={url}
            country={country}
            clickcount={clickcount}
            votes={votes}
            className="text-white rounded-full"
            stationList={stationList}
          />
        </div>

        <div className={`flex items-center gap-4`}>
          <button
            className={`text-gray-400 hover:text-black focus:outline-none cursor-pointer hover:scale-110 transition-all`}
          >
            {/* Like button */}
            <HeartIcon className="w-5 h-5" alt="Like Button" />
          </button>

          <button
            className={`text-gray-400 hover:text-black focus:outline-none hover:scale-110 transition-all`}
          >
            {/* Context_menu button */}
            <DotsVerticalIcon className="w-5 h-5" alt="Context Menu" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RadioCard;