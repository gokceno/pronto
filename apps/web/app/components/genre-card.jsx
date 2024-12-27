import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';



const colorCombinations = [

  'from-pink-500 via-purple-500 to-indigo-500',
  'from-orange-500 via-red-500 to-rose-500',
  'from-green-500 via-teal-500 to-blue-500',
  'from-yellow-500 via-orange-500 to-red-500',
  'from-blue-500 via-cyan-500 to-teal-500',
  'from-indigo-500 via-purple-500 to-pink-500',
  'from-cyan-500 via-blue-500 to-indigo-500',
  'from-emerald-500 via-green-500 to-lime-500',
  'from-rose-500 via-pink-500 to-fuchsia-500',
  'from-amber-500 via-orange-500 to-yellow-500'
];

export const GenreCard = ({ genre }) => {
  const { t } = useTranslation();
  const genreColor = useMemo(() => {
    const hash = genre.name
      .split('')
      .reduce((acc, char, i) => {
        return char.charCodeAt(0) * (i + 1) + ((acc << 5) - acc);
      }, 0);
    const index = Math.abs(hash) % colorCombinations.length;
    return colorCombinations[index];
  }, [genre.name]);

  const genreName = genre.name.toLowerCase();
  
  return (
    <Link
      to={`/genre/${genre.id}`}
      className={`w-full rounded-xl relative overflow-hidden group`}
    >
      <div 
        className={`aspect-[2.16/1] bg-gradient-to-br ${genreColor} p-4 transition-all duration-300 hover:brightness-110`}
      >
        <div className="flex flex-col h-full justify-between relative">
          <div className="flex justify-between items-center">
            
              <p className="bg-blue-100 text-blue-900 text-sm font-jakarta font-bold rounded-md px-2 py-1">
                {genre.stationcount} {t('genreCardStations')}
              </p>

            <button className="text-white/80 hover:text-white">
              <span className="sr-only">More options</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </div>
          <h4 className="text-white text-h4 font-jakarta capitalize">
            {genreName}
          </h4>

        </div>
      </div>
    </Link>
  );
};
