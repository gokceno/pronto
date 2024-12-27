// GenreCardContainer.jsx
import { useTranslation } from 'react-i18next';

export const GenreCardContainer = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="p-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t('radioByGenre')}</h2>
        <button className="text-blue-500 hover:text-blue-600 border font-bold border-black rounded-full px-4 py-2">
          {t('showAll')}
        </button>
      </div>
      {children}
    </div>
  );
};
