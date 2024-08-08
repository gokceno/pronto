// eslint-disable-next-line react/prop-types
const Truncate = ({ children }) => {
  const text = typeof children === 'string' ? children : '';
  const maxLength = 18;

  if (text.length <= maxLength) {
    return <>{text}</>;
  }

  const truncatedText = text.slice(0, maxLength) + '...';
  return <>{truncatedText}</>;
};

export default Truncate;