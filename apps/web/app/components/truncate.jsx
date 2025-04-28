// eslint-disable-next-line react/prop-types
const Truncate = ({ children, maxLength = 18 }) => {
  const text = typeof children === 'string' ? children : '';

  if (text.length <= maxLength) {
    return <>{text}</>;
  }

  const truncatedText = text.slice(0, maxLength) + '...';
  return <>{truncatedText}</>;
};

export default Truncate;