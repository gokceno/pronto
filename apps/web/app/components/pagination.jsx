import { Link } from "@remix-run/react";

const Pagination = ({
  // eslint-disable-next-line react/prop-types
  totalRecords,
  // eslint-disable-next-line react/prop-types
  recordsPerPage,
  // eslint-disable-next-line react/prop-types
  currentPage,
}) => {
  const linkItemClassNames =
    "px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800";
  const linkItemSelectedClassNames = linkItemClassNames + " underline";
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const renderPageNumbers = () => {
    currentPage = currentPage ? +currentPage : 1;
    const pageNumbers = [];
    const pagingWindowWidth = 5;
    const pagingWindowStart = (currentPage-pagingWindowWidth) >= 1 ? (currentPage-pagingWindowWidth) : 1;
    const pagingWindowEnd = (currentPage+pagingWindowWidth) >= totalPages ? totalPages : (currentPage+pagingWindowWidth);
    if (currentPage > pagingWindowWidth) {
      pageNumbers.push(
        <Link to={"?p=1"} key="1" className={linkItemClassNames}>
          1
        </Link>,
      );
      pageNumbers.push(<span key="ellipsis-1" className={linkItemClassNames}>&hellip;</span>);
    }
    for (let i=pagingWindowStart;i<=pagingWindowEnd;i++) {
      pageNumbers.push(
        <Link to={"?p=" + i} key={i} className={currentPage == i ? linkItemSelectedClassNames : linkItemClassNames}>
          {i}
        </Link>,
      );
    }
    if (totalPages > pagingWindowEnd) {
      pageNumbers.push(<span key="ellipsis-2" className={linkItemClassNames}>&hellip;</span>);
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
