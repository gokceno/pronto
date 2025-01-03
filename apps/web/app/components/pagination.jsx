import { Link } from "@remix-run/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const Pagination = ({
  totalRecords,
  recordsPerPage,
  currentPage,
}) => {
  const { t } = useTranslation();
  const baseClassNames = "px-3 py-2 text-sm font-medium";
  const linkItemClassNames = `${baseClassNames} text-gray-500 hover:text-gray-700`;
  const linkItemSelectedClassNames = `${baseClassNames} text-white bg-blue-500 rounded-lg`;
  const navigationButtonClassNames = `${baseClassNames} text-gray-500 hover:text-gray-700 flex items-center gap-1`;

  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  currentPage = currentPage ? +currentPage : 1;

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const VISIBLE_PAGES = 6;
    
    // Add Previous button
    pageNumbers.push(
      <Link
        to={currentPage > 1 ? `?p=${currentPage - 1}` : "#"}
        key="prev"
        className={`${navigationButtonClassNames} ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
      >
        <ChevronLeft className="w-4 h-4" />
        {t('previousPage')}
      </Link>
    );

    // Calculate range of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(VISIBLE_PAGES / 2));
    let endPage = Math.min(totalPages, startPage + VISIBLE_PAGES - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < VISIBLE_PAGES) {
      startPage = Math.max(1, endPage - VISIBLE_PAGES + 1);
    }

    // Always show first page
    if (startPage > 1) {
      pageNumbers.push(
        <Link
          to="?p=1"
          key={1}
          className={currentPage === 1 ? linkItemSelectedClassNames : linkItemClassNames}
        >
          1
        </Link>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span key="start-ellipsis" className={baseClassNames}>
            ...
          </span>
        );
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Link
          to={`?p=${i}`}
          key={i}
          className={currentPage === i ? linkItemSelectedClassNames : linkItemClassNames}
        >
          {i}
        </Link>
      );
    }

    // Show last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="end-ellipsis" className={baseClassNames}>
            ...
          </span>
        );
      }
      pageNumbers.push(
        <Link
          to={`?p=${totalPages}`}
          key={totalPages}
          className={currentPage === totalPages ? linkItemSelectedClassNames : linkItemClassNames}
        >
          {totalPages}
        </Link>
      );
    }

    // Add Next button
    pageNumbers.push(
      <Link
        to={currentPage < totalPages ? `?p=${currentPage + 1}` : "#"}
        key="next"
        className={`${navigationButtonClassNames} ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
      >
        {t('nextPage')}
        <ChevronRight className="w-4 h-4" />
      </Link>
    );

    return pageNumbers;
  };

  return (
    <nav className="flex items-center justify-center space-x-1">
      {renderPageNumbers()}
    </nav>
  );
};

export default Pagination;
