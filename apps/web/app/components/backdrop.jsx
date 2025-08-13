import { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

/**
 * Backdrop component that provides a dark overlay for modals and popups
 *
 * @param {Object} props
 * @param {boolean} props.show - Whether to show the backdrop
 * @param {function} props.onClick - Callback when backdrop is clicked
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.zIndex - Z-index value (default: 1000)
 * @param {React.ReactNode} props.children - Child components to render on top of backdrop
 */
export default function Backdrop({
  show = false,
  onClick,
  className = "",
  zIndex = 1000,
  children,
}) {
  useEffect(() => {
    if (show) {
      // Prevent body scroll when backdrop is shown
      document.body.style.overflow = "hidden";

      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty(
        "--scrollbar-width",
        `${scrollbarWidth}px`,
      );
      document.body.style.paddingRight = "var(--scrollbar-width, 0px)";
    } else {
      // Restore body scroll when backdrop is hidden
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.documentElement.style.removeProperty("--scrollbar-width");
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.documentElement.style.removeProperty("--scrollbar-width");
    };
  }, [show]);

  if (!show) {
    return null;
  }

  const backdropContent = (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${className}`}
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
    >
      {/* Only the backdrop area is clickable */}
      <div
        className="absolute inset-0 w-full h-full"
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Escape" && onClick) {
            onClick();
          }
        }}
        aria-label="Close modal"
        role="button"
        tabIndex={0}
        style={{ pointerEvents: "auto" }}
      />
      {/* Content area is not clickable for backdrop */}
      <div className="relative z-10" style={{ pointerEvents: "auto" }}>
        {children}
      </div>
    </div>
  );

  // Use portal to render at the end of body to ensure it's above everything
  return ReactDOM.createPortal(backdropContent, document.body);
}

Backdrop.propTypes = {
  show: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  zIndex: PropTypes.number,
  children: PropTypes.node,
};
