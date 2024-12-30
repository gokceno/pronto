import { getCountryFlag } from '../utils/flag-utils';
import Truncate from './truncate.jsx';

export const CountryCard = ({ name, countryCode, stationCount }) => {
  const flagSrc = getCountryFlag(countryCode);

  return (
    <div className="flex items-center bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 mr-4">
        <img 
          src={flagSrc} 
          alt={`${name} flag`}
          className="w-full h-full rounded-lg object-cover"
          onError={(e) => {
            e.target.src = '/assets/flags/placeholder.svg';
          }}
        />
      </div>
      <div className="flex flex-col">
        <h3 className="text-gray-900 font-medium text-base"><Truncate>{name}</Truncate></h3>
        <p className="text-gray-500 text-sm">{stationCount} istasyon</p>
      </div>
    </div>
  );
};
