/**
 * Utility for managing search history with separation between logged-in and anonymous users
 */

const ANONYMOUS_SEARCHES_KEY = 'latestSearches_anonymous';
const MAX_SEARCHES = 3;

/**
 * Get the storage key for a user's search history
 * @param {Object|null} user - User object with id property, or null for anonymous users
 * @returns {string} The localStorage key for the user's search history
 */
const getSearchHistoryKey = (user) => {
  if (user && user.id) {
    return `latestSearches_user_${user.id}`;
  }
  return ANONYMOUS_SEARCHES_KEY;
};

/**
 * Get the latest searches for a user
 * @param {Object|null} user - User object with id property, or null for anonymous users
 * @returns {Array} Array of search strings
 */
export const getLatestSearches = (user) => {
  const key = getSearchHistoryKey(user);
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (error) {
    console.error('Error retrieving search history:', error);
    return [];
  }
};

/**
 * Add a search to the user's search history
 * @param {string} searchValue - The search term to add
 * @param {Object|null} user - User object with id property, or null for anonymous users
 */
export const addToLatestSearches = (searchValue, user) => {
  if (!searchValue || typeof searchValue !== 'string') {
    return;
  }

  const trimmedValue = searchValue.trim();
  if (!trimmedValue) {
    return;
  }

  const key = getSearchHistoryKey(user);

  try {
    let searches = getLatestSearches(user);

    // Remove the search if it already exists (case-insensitive)
    searches = searches.filter(
      (search) => search.toLowerCase() !== trimmedValue.toLowerCase()
    );

    // Add the new search at the beginning
    searches.unshift(trimmedValue);

    // Keep only the most recent searches
    searches = searches.slice(0, MAX_SEARCHES);

    localStorage.setItem(key, JSON.stringify(searches));

    // Trigger storage event for components listening to changes
    window.dispatchEvent(new StorageEvent('storage', {
      key: key,
      newValue: JSON.stringify(searches),
      oldValue: localStorage.getItem(key),
      storageArea: localStorage
    }));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
};

/**
 * Remove a specific search from the user's search history
 * @param {string} searchToRemove - The search term to remove
 * @param {Object|null} user - User object with id property, or null for anonymous users
 */
export const removeFromLatestSearches = (searchToRemove, user) => {
  const key = getSearchHistoryKey(user);

  try {
    let searches = getLatestSearches(user);
    searches = searches.filter((search) => search !== searchToRemove);
    localStorage.setItem(key, JSON.stringify(searches));

    // Trigger storage event for components listening to changes
    window.dispatchEvent(new StorageEvent('storage', {
      key: key,
      newValue: JSON.stringify(searches),
      oldValue: localStorage.getItem(key),
      storageArea: localStorage
    }));
  } catch (error) {
    console.error('Error removing search from history:', error);
  }
};

/**
 * Clear all searches for a user
 * @param {Object|null} user - User object with id property, or null for anonymous users
 */
export const clearLatestSearches = (user) => {
  const key = getSearchHistoryKey(user);

  try {
    localStorage.setItem(key, JSON.stringify([]));

    // Trigger storage event for components listening to changes
    window.dispatchEvent(new StorageEvent('storage', {
      key: key,
      newValue: JSON.stringify([]),
      oldValue: localStorage.getItem(key),
      storageArea: localStorage
    }));
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
};

/**
 * Migrate existing searches from the old format to the new format
 * This should be called once when the user first loads the app after this change
 * @param {Object|null} user - User object with id property, or null for anonymous users
 */
export const migrateSearchHistory = (user) => {
  const oldKey = 'latestSearches';
  const newKey = getSearchHistoryKey(user);

  // Only migrate if the old key exists and the new key doesn't
  if (localStorage.getItem(oldKey) && !localStorage.getItem(newKey)) {
    try {
      const oldSearches = JSON.parse(localStorage.getItem(oldKey) || '[]');
      localStorage.setItem(newKey, JSON.stringify(oldSearches));

      // If this is an anonymous user, we can remove the old key
      // If this is a logged-in user, we keep the old key for other anonymous sessions
      if (!user) {
        localStorage.removeItem(oldKey);
      }
    } catch (error) {
      console.error('Error migrating search history:', error);
    }
  }
};

/**
 * Hook-like function to set up storage event listener for search history changes
 * @param {Function} callback - Function to call when search history changes
 * @param {Object|null} user - User object with id property, or null for anonymous users
 * @returns {Function} Cleanup function to remove the event listener
 */
export const onSearchHistoryChange = (callback, user) => {
  const key = getSearchHistoryKey(user);

  const handleStorageChange = (event) => {
    if (event.key === key) {
      callback(JSON.parse(event.newValue || '[]'));
    }
  };

  window.addEventListener('storage', handleStorageChange);

  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};
