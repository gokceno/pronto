import Truncate from './truncate.jsx'
import { useTranslation } from 'react-i18next';

export const getCountryFlag = (countryCode) => {
  if (!countryCode) return '/assets/flags/placeholder.svg';
  
  return `/assets/flags/${countryCode.toLowerCase()}.svg`;
};

export const CountryCard = ({ name, countryCode, stationCount }) => {
  const { t } = useTranslation();
  const flagSrc = getCountryFlag(countryCode);

  return (
    <div className="w-[302px] h-[88px] flex items-center bg-white rounded-lg p-4 hover:shadow-lg hover:outline hover:outline-blue-500 hover:outline-2 transition-all">
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
      <div className="flex flex-col ">
        <h3 className="text-gray-900 font-medium text-base font-semibold"><Truncate>{name}</Truncate></h3>
          <span className="text-gray-500 text-sm">
          {t('cardStations', { count: stationCount })}
          </span>
      </div>
    </div>
  );
};
