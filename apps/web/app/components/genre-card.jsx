import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import Truncate from './truncate.jsx';
import { generateLocalizedRoute } from '../utils/generate-route.jsx';

const colorCombinations = [
  'from-[#ECB8C8] to-[#E59E18]',
  'from-[#EAE2BE] to-[#2555E3]',
  'from-[#EAE3BA] to-[#E226B3]',
  'from-[#BCE3E8] to-[#FB4125]',
  'from-[#E1D4B6] to-[#7E25DE]',
  'from-[#DDBFBF] to-[#31B86E]',
  'from-[#E2CCBE] to-[#009FDE]',
  'from-[#DECDFF] to-[#127EA6]',
  'from-[#EAE3BA] to-[#E226B3]'
];

export const GenreCard = ({ name, stationcount, locale, index = 0 }) => {
  const { t } = useTranslation();
  const colorIndex = index % colorCombinations.length;
  const genreColor = colorCombinations[colorIndex];
  const genreName = name.toLowerCase();

  return (
    <Link
      to={generateLocalizedRoute(locale, `/details/genre/${encodeURIComponent(genreName)}`)}
      className="w-full max-w-[302px] h-[140px] rounded-xl relative overflow-hidden group"
    >
      <div 
        className={`h-full bg-gradient-to-tl ${genreColor} p-4 transition-all duration-300 hover:brightness-110`}
      >
        <div className="flex flex-col h-full justify-between relative">
          <div className="flex justify-between items-center">
            <span className="bg-blue-100 text-blue-900 text-sm font-jakarta font-bold rounded-md px-2 py-1">
              {t('cardStations', { count: stationcount })}
            </span>
          </div>
          <h4 className="text-white text-[24px] font-jakarta capitalize font-semibold">
            <Truncate>{genreName}</Truncate>
          </h4>
        </div>
      </div>
    </Link>
  );
};