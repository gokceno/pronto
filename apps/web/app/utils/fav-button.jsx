import { useState, useEffect } from "react";
import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import { useNavigate } from "@remix-run/react";

const FavButton = ({
  targetId,
  targetType = "",
  className = "",
  locale = "en",
  onFavoriteChange = () => {},
  type = "component",
  user = null,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const navigate = useNavigate();

  // Check initial favorite status when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      setIsCheckingStatus(true);

      try {
        // API call to check if this item is already favorited
        const response = await fetch(
          `/api/favorites?targetId=${targetId}&targetType=${targetType}`,
        );

        if (response.ok) {
          const data = await response.json();
          setIsFavorited(data.isFavorited);
          setIsAuthenticated(data.authenticated);
        } else if (response.status === 401) {
          // User is not authenticated
          setIsAuthenticated(false);
          console.warn(
            "[FavButton] Authentication required to check favorites status",
          );
        }
      } catch (error) {
        console.error("[FavButton] Failed to check favorite status:", error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    if (targetId) {
      checkFavoriteStatus();
    } else {
      setIsCheckingStatus(false);
    }
  }, [targetId, targetType, locale]);

  // Helper function to redirect to login page
  const redirectToLogin = () => {
    const currentPath = window.location.pathname;
    navigate(`/${locale}/login?redirectTo=${encodeURIComponent(currentPath)}`);
  };

  const handleFavClick = async (e) => {
    e.preventDefault(); // Prevent event bubbling to parent links
    e.stopPropagation();

    if (isLoading || isCheckingStatus) {
      return;
    }

    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    setIsLoading(true);
    try {
      const method = isFavorited ? "DELETE" : "POST";
      const response = await fetch("/api/favorites", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetId,
          targetType,
        }),
        // Include credentials to ensure cookies are sent
        credentials: "same-origin",
      });

      if (response.ok) {
        setIsFavorited(!isFavorited);
        // Callback to parent component
        onFavoriteChange(!isFavorited);
      } else {
        // Handle error - could be unauthorized or server error
        try {
          const errorData = await response.json();
          console.error("[FavButton] Favorite operation failed:", errorData);
        } catch (e) {
          console.error("[FavButton] Failed to parse error response", e);
        }

        // If unauthorized, redirect to login
        if (response.status === 401) {
          setIsAuthenticated(false);
          redirectToLogin();
        }
      }
    } catch (error) {
      console.error("[FavButton] Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={handleFavClick}
      className={`hover:scale-110 flex items-center justify-center rounded-full transition-all text-white cursor-pointer ${isLoading || isCheckingStatus ? "opacity-50" : ""} ${className}`}
      role="button"
      tabIndex={0}
      disabled={isLoading || isCheckingStatus}
    >
      {isFavorited ? (
        <HeartFilledIcon
          className={`${
            type === "title" ? "w-8 h-8 text-red-500" : "w-5 h-5 text-red-500"
          }`}
        />
      ) : (
        <HeartIcon
          className={`hover:text-red-500 ${type === "title" ? "w-8 h-8 text-white" : "text-gray-400 w-5 h-5"}`}
        />
      )}
    </div>
  );
};

export default FavButton;
