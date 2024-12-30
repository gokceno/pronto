import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const CardContainer = ({ children, type }) => {
  const { t } = useTranslation();

  const getTitleText = () => {
    switch (type) {
      case 'country':
        return t('countries');
      case 'genre':
        return t('radioByGenre');
      default:
        return '';
    }
  };

  const getBackgroundClass = () => {
    return type === 'country' ? 'bg-blue-100' : '';
  };

  return (
    <div className={`p-6 sm:px-6 lg:px-8 ${getBackgroundClass()}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{getTitleText()}</h2>
        <Link to={`/${type}`} className="text-blue-500 hover:text-blue-600 border font-bold border-gray-400 rounded-full px-4 py-2">
          {t('showAll')}
        </Link>
      </div>
      {children}
    </div>
  );
};
