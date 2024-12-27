import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const CountryCard = ({ country }) => {
    return (
      <div className="flex items-center bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 mr-4">
          <img 
            src={country.flag} 
            alt={`${country.name} flag`}
            className="w-full h-full rounded-lg object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-gray-900 font-medium text-base">{country.name}</h3>
          <p className="text-gray-500 text-sm">{country.stationCount} istasyon</p>
        </div>
      </div>
    );
  };
  
 
  