export const getCountryFlag = (countryCode) => {
  if (!countryCode) return '/assets/flags/placeholder.svg';
  
  return `/assets/flags/${countryCode.toLowerCase()}.svg`;
};
