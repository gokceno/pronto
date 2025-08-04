import { Cross1Icon, CheckIcon, PlusIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { useFetcher, useRevalidator, useNavigate } from "@remix-run/react";
import { NoListMenu } from "./no-list-menu";
import PropTypes from "prop-types";

export async function getListsContainingStation(stationuuid) {
  try {
    const response = await fetch("/api/radio-lists");
    if (!response.ok) {
      throw new Error("Failed to fetch lists");
    }
    const data = await response.json();

    // Filter lists to only include those containing the station and not deleted
    return data.lists
      ? data.lists.filter(
          (list) =>
            !list.isDeleted &&
            list.radios.some((radio) => radio.id === stationuuid),
        )
      : [];
  } catch (error) {
    console.error("Error fetching lists containing station:", error);
    return [];
  }
}

export const AddToListMenu = ({
  stationuuid = "",
  onClose,
  renderBackdrop = true,
}) => {
  const { t } = useTranslation();
  const [selectedLists, setSelectedLists] = useState([]);
  const [listsContainingStation, setListsContainingStation] = useState([]);
  const [listsForRemoval, setListsForRemoval] = useState([]);
  const [exiting, setExiting] = useState(false);
  const menuRef = useRef(null);
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const navigate = useNavigate();

  const toggleListSelection = (index) => {
    setSelectedLists((prev) => {
      if (prev.includes(index)) {
        // If removing a selection that was initially in listsContainingStation, add to removal list
        if (listsContainingStation.includes(index)) {
          setListsForRemoval((prevRemoval) => [...prevRemoval, index]);
        }
        return prev.filter((i) => i !== index);
      } else {
        // If adding back a selection that was in removal list, remove from removal list
        if (listsForRemoval.includes(index)) {
          setListsForRemoval((prevRemoval) =>
            prevRemoval.filter((i) => i !== index),
          );
        }
        return [...prev, index];
      }
    });
  };

  const handleClose = () => {
    setExiting(true);
  };

  const handleAnimationEnd = (e) => {
    // Only trigger onClose when the menu itself or the background animates out
    if (
      exiting &&
      (e.target === menuRef.current ||
        e.target.classList.contains("bg-black/50"))
    ) {
      onClose();
    }
  };

  // Fetch user lists
  useEffect(() => {
    const loadLists = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/radio-lists");
        if (!response.ok) {
          throw new Error("Failed to fetch lists");
        }
        const data = await response.json();
        // Filter out deleted lists
        const activeLists = data.lists
          ? data.lists.filter((list) => !list.isDeleted)
          : [];
        setLists(activeLists);

        // Identify which lists already contain this station
        if (
          activeLists.length > 0 &&
          stationuuid &&
          stationuuid.trim() !== ""
        ) {
          const containingListIndexes = [];

          activeLists.forEach((list, index) => {
            // Check if any radio in the list matches the stationuuid
            // Using string comparison and checking multiple possible ID fields
            const hasStation = list.radios.some((radio) => {
              // Check various possible ID properties with string comparison
              return (
                (radio.id && String(radio.id) === String(stationuuid)) ||
                (radio.stationuuid &&
                  String(radio.stationuuid) === String(stationuuid)) ||
                (radio.uuid && String(radio.uuid) === String(stationuuid))
              );
            });

            if (hasStation) {
              containingListIndexes.push(index);
            }
          });

          setListsContainingStation(containingListIndexes);
          setSelectedLists(containingListIndexes);
        }
      } catch (error) {
        console.error("Error fetching lists:", error);
        setLists([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLists();
  }, [stationuuid]);

  // Reset selections when stationuuid changes
  useEffect(() => {
    // Reset selections when stationuuid changes or when component unmounts
    return () => {
      setSelectedLists([]);
      setListsContainingStation([]);
      setListsForRemoval([]);
    };
  }, [stationuuid]);

  // Handle adding station to list
  useEffect(() => {
    if (fetcher.state === "submitting") {
      setIsAdding(true);
    } else if (
      fetcher.state === "idle" &&
      fetcher.data &&
      fetcher.data.success
    ) {
      setIsAdding(false);
      onClose();
      revalidator.revalidate();
    } else if (fetcher.state === "idle" && isAdding) {
      setIsAdding(false);
    }
  }, [fetcher.state, fetcher.data, onClose, isAdding, revalidator]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "var(--scrollbar-width, 0px)";

    // Calculate scrollbar width once mounted
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty(
      "--scrollbar-width",
      `${scrollbarWidth}px`,
    );

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  // Handle adding a station to the selected lists and removing from deselected lists
  const handleAddToLists = async () => {
    if (
      (selectedLists.length === 0 && listsForRemoval.length === 0) ||
      !stationuuid
    )
      return;

    setIsAdding(true);

    try {
      // Add station to newly selected lists (exclude those that already contained the station)
      const newSelections = selectedLists.filter(
        (index) => !listsContainingStation.includes(index),
      );

      // Only proceed with API calls if there are lists to update
      if (newSelections.length === 0 && listsForRemoval.length === 0) {
        setIsAdding(false);
        onClose();
        return;
      }
      const addPromises = newSelections.map((index) => {
        const listId = lists[index].id;
        return fetch("/api/radio-lists?operation=add-radio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userListId: listId,
            radioId: stationuuid,
          }),
        }).then((resp) => resp.json());
      });

      // Remove station from deselected lists
      const removePromises = listsForRemoval.map((index) => {
        const listId = lists[index].id;
        return fetch("/api/radio-lists?operation=remove-radio", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userListId: listId,
            radioId: stationuuid,
          }),
        }).then((resp) => resp.json());
      });

      // Execute all promises
      await Promise.all([...addPromises, ...removePromises]);

      // Use fetcher to trigger revalidation
      fetcher.submit(
        {},
        {
          method: "get",
          action: "/api/radio-lists",
        },
      );

      onClose();
      revalidator.revalidate();
    } catch (error) {
      console.error("Error updating station in lists:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // If there are no lists and we're not loading, show the NoListMenu
  if (!isLoading && lists.length === 0) {
    return <NoListMenu onClose={onClose} renderBackdrop={renderBackdrop} />;
  }

  return (
    <>
      {renderBackdrop && (
        <div
          className={`fixed inset-0 bg-black/50 z-40 ${
            exiting ? "animate-fade-out" : "animate-fade-in"
          }`}
          onAnimationEnd={exiting ? handleAnimationEnd : undefined}
        />
      )}
      <div
        ref={menuRef}
        className={`flex flex-col w-[25.6875rem] h-auto rounded-xl justify-between bg-white z-50
          ${exiting ? "animate-fade-out" : "animate-fade-in"}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="flex flex-col">
          <div className="w-full h-[5rem] gap-4 p-6 flex flex-row items-center justify-between">
            <span className="font-jakarta font-semibold text-[#00192C] text-[1.25rem]/[1.75rem]">
              {t("addToRadioList")}
            </span>

            <div className="h-8 w-8 flex rounded-full justify-end">
              <button
                className="transition-all hover:scale-125 group"
                onClick={handleClose}
              >
                <Cross1Icon className="w-6 h-6 text-[#A1A1AA] group-hover:text-[#DB0A3C]" />
              </button>
            </div>
          </div>
          <div className="w-full h-[0.0625rem] bg-gray-300" />
        </div>

        <div className="w-full h-full p-6 gap-6">
          <div className="w-full h-full flex flex-col">
            <span className="font-jakarta font-semibold text-base text-[#02141C]">
              {t("createdLists")}
            </span>

            <div className="w-full flex flex-col mt-4 max-h-[10rem] overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <span className="font-jakarta text-sm/[1.375rem] text-[#00192C]">
                    {t("loading")}
                  </span>
                </div>
              ) : (
                lists.map((list, index) => (
                  <button
                    key={index}
                    className="w-full h-[3.125rem] transition-all p-2 hover:rounded-lg hover:bg-[#E8F2FF] flex flex-row items-center justify-between cursor-pointer text-left"
                    onClick={() => toggleListSelection(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        toggleListSelection(index);
                      }
                    }}
                  >
                    <div className="flex flex-col h-[2.125rem]">
                      <span className="font-jakarta text-sm/[1.375rem] text-[#00192C]">
                        {list.userListName}
                      </span>
                      <span className="font-jakarta text-[0.625rem]/[0.875rem] text-[#4F5457]">
                        {t("cardStations", { count: list.radios.length })}
                      </span>
                    </div>
                    <div className="transition-opacity duration-300 ease-in-out">
                      <CheckIcon
                        className={`w-6 h-6 text-[#167AFE] transition-opacity duration-300 ease-in-out ${
                          selectedLists.includes(index)
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="w-full h-[0.0625rem] bg-gray-300" />
          <div className="w-full h-[4.5rem] flex flex-row justify-between items-center px-4">
            <button
              className="gap-2 items-center justify-center relative group"
              onClick={handleClose}
            >
              <span className="font-jakarta font-semibold text-sm/[1.375rem] text-[#167AFE]">
                {t("cancel")}
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-[0.1rem] bg-[#167AFE] transition-all duration-300 group-hover:w-full"></span>
            </button>

            <div className="w-[19.6875rem] h-10 flex flex-row justify-between items-center">
              <button
                onClick={() => {
                  onClose();
                  // Find header component in DOM and trigger its create list menu
                  const headerCreateListBtn = document.querySelector(
                    "[data-create-list-btn]",
                  );
                  if (headerCreateListBtn) {
                    headerCreateListBtn.click();
                  } else {
                    navigate("/radio-lists");
                  }
                }}
                className="px-4 transition-all hover:scale-105 rounded-[2rem] border border-gray-200 bg-white w-[13.625rem] flex flex-row h-[2.5rem] gap-1 items-center justify-center"
              >
                <span className="font-jakarta font-semibold text-[0.875rem]/[1.375rem] text-[#167AFE] line-clamp-1">
                  {t("createNewList")}
                </span>
              </button>

              <button
                onClick={handleAddToLists}
                disabled={
                  (selectedLists.length === 0 &&
                    listsForRemoval.length === 0) ||
                  isAdding
                }
                className={`px-4 transition-all hover:scale-105 rounded-[2rem] ${
                  (selectedLists.length === 0 &&
                    listsForRemoval.length === 0) ||
                  isAdding
                    ? "bg-gray-400"
                    : "bg-[#167AFE]"
                } w-[5.5625rem] flex flex-row h-[2.5rem] gap-1 items-center justify-center`}
              >
                <PlusIcon className="w-6 h-6 text-white" />
                <span className="font-jakarta font-semibold text-[0.875rem]/[1.375rem] text-white">
                  {isAdding ? t("adding") : t("add")}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

AddToListMenu.propTypes = {
  stationuuid: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  renderBackdrop: PropTypes.bool,
};
