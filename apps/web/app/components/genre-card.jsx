import { Link } from 'react-router-dom';

const genreColors = {
  'pop': 'from-orange-400 to-pink-500',
  'hip-pop': 'from-blue-400 to-blue-600',
  'r&b': 'from-pink-400 to-purple-500',
  'indie': 'from-red-400 to-orange-500',
  'dance': 'from-purple-400 to-pink-500',
  'country': 'from-cyan-400 to-blue-500',
  'rock': 'from-blue-400 to-purple-500',
  'metal': 'from-green-400 to-blue-500',
};

export const GenreCard = ({ genre }) => {
  const genreName = genre.name.toLowerCase();
  
  return (
    <Link
      to={`/genre/${genre.id}`}
      className={`w-[302px] h-[140px] rounded-xl relative overflow-hidden group`}
    >
      <div className={`w-full h-full bg-gradient-to-br ${genreColors[genreName] || 'from-gray-400 to-gray-600'} p-4`}>
        <div className="flex flex-col h-full justify-between relative">
          <div className="flex justify-between items-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
              <p className="text-white text-sm">
                {genre.stationcount} istasyon
              </p>
            </div>
            <button className="text-white/80 hover:text-white">
              <span className="sr-only">More options</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </div>
          <h3 className="text-white text-2xl font-bold capitalize">
            {genreName}
          </h3>
        </div>
      </div>
    </Link>
  );
};