import { Link } from "@remix-run/react";

const Pagination = ({
  // eslint-disable-next-line react/prop-types
  totalRecords,
  // eslint-disable-next-line react/prop-types
  recordsPerPage,
}) => {
  const linkItemClassNames =
    "px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800";
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= (totalPages > 10 ? 10 : totalPages); i++) {
      pageNumbers.push(
        <Link to={"?p=" + i} key={i} className={linkItemClassNames}>
          {i}
        </Link>,
      );
    }
    if (totalPages > 10) {
      pageNumbers.push(<span className={linkItemClassNames}>...</span>);
      pageNumbers.push(
        <Link to={"?p=" + totalPages} key={totalPages} className={linkItemClassNames}>
          {totalPages}
        </Link>,
      );
    }
    return pageNumbers;
  };
  return <nav className="inline-flex">{renderPageNumbers()}</nav>;
};

export default Pagination;
