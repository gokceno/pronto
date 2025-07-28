import Truncate from "./truncate.jsx";
import { useTranslation } from "react-i18next";
import { Link } from "@remix-run/react";
import { generateLocalizedRoute } from "../utils/generate-route.jsx";
import { formatNumber } from "../utils/format-number.js";

export const getCountryFlag = (countryCode) => {
  if (!countryCode) return "/assets/flags/placeholder.svg";

  return `/assets/flags/${countryCode.toLowerCase()}.svg`;
};

export const CountryCard = ({
  name,
  countryCode,
  stationCount = 0,
  locale,
}) => {
  const { t } = useTranslation();
  const flagSrc = getCountryFlag(countryCode);

  return (
    <Link
      to={generateLocalizedRoute(
        locale,
        `/details/country/${countryCode.toUpperCase()}`,
      )}
      className="w-[18.875rem] h-[5.5rem] flex items-center bg-white rounded-lg p-4 hover:scale-105 hover:bg-[#E8F2FF] hover:outline-2 transition-all"
    >
      <div className="w-12 h-12 mr-4">
        <img
          src={flagSrc}
          alt={`${name} flag`}
          className="w-full h-full rounded-lg object-cover border border-gray-200"
          onError={(e) => {
            e.target.src = "/assets/flags/placeholder.svg";
          }}
        />
      </div>
      <div className="flex flex-col ">
        <h3 className="text-gray-900 font-medium text-base">
          <Truncate>{name}</Truncate>
        </h3>
        <span className="text-gray-500 text-sm">
          {t("cardStations", { count: formatNumber(locale, stationCount) })}
        </span>
      </div>
    </Link>
  );
};
