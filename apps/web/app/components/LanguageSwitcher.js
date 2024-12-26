import React from 'react';
import i18n from '../i18n';

const LanguageSwitcher = () => {
  const switchToEnglish = () => {
    i18n.changeLanguage('en');
  };

  return (
    <button onClick={switchToEnglish}>
      Switch to English
    </button>
  );
};

export default LanguageSwitcher; 