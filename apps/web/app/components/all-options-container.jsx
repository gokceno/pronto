import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const BACKGROUND_CLASSES = {
  'countries': 'bg-blue-100',
  'genres': 'bg-white',
  // Add more types here as needed
  'default': ''
};

export const AllOptionsContainer = ({ 
  children, 
  type, 
  title = '', 
  customBackgroundConfig = {} 
}) => {
  const { t } = useTranslation();

  const getBackgroundClass = () => {
    const backgroundConfig = { ...BACKGROUND_CLASSES, ...customBackgroundConfig };
    return backgroundConfig[type] || backgroundConfig.default;
  };

  return (
    <div className={`p-6 sm:px-6 lg:px-8 ${getBackgroundClass()}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t(type)}</h2>
      </div>
      {children}
    </div>
  );
};
