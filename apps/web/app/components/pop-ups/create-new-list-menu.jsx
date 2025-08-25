import { Cross1Icon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useState } from "react";
import PropTypes from "prop-types";
import React from "react";
import Backdrop from "../backdrop";

export const CreateNewListMenu = ({ onClose, parentRef }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState({});
  const fetcher = useFetcher();
  const navigate = useNavigate();

  // Handle form submission state
  React.useEffect(() => {
    if (fetcher.state === "submitting") {
      setIsCreating(true);
      setErrors({});
    } else if (
      fetcher.state === "idle" &&
      fetcher.data &&
      fetcher.data.success
    ) {
      setIsCreating(false);
      onClose();
      navigate("/radio-lists");
    } else if (fetcher.state === "idle" && fetcher.data && fetcher.data.error) {
      setIsCreating(false);
      setErrors({ general: "validation.listCreationFailed" });
    } else if (fetcher.state === "idle" && isCreating) {
      setIsCreating(false);
    }
  }, [fetcher.state, fetcher.data, navigate, onClose, isCreating]);

  const validateTitle = (value) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return "validation.titleRequired";
    }
    if (trimmedValue.length < 2) {
      return "validation.titleMinLength";
    }
    if (trimmedValue.length > 50) {
      return "validation.titleMaxLength";
    }
    return null;
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    // Clear errors when user starts typing
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: null }));
    }
  };

  const handleSubmit = () => {
    const titleError = validateTitle(title);

    if (titleError) {
      setErrors({ title: titleError });
      return;
    }

    setErrors({});
    setIsCreating(true);
    fetcher.submit(
      {
        userListName: title.trim(),
      },
      {
        method: "post",
        action: "/api/radio-lists?operation=create-list",
        encType: "application/json",
      },
    );
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Backdrop show={true} onClick={handleClose} zIndex={1000}>
      <div
        ref={(el) => {
          if (parentRef) parentRef.current = el;
        }}
        className="flex flex-col w-[25.6875rem] h-auto rounded-xl justify-between bg-white"
      >
        <div className="flex flex-col">
          <div className="w-full h-[5rem] gap-4 p-6 flex flex-row items-center justify-between">
            <span className="font-jakarta font-semibold text-[#00192C] text-[1.25rem]/[1.75rem]">
              {t("newList")}
            </span>

            <div className="h-8 w-8 flex rounded-full justify-end">
              <button
                onClick={handleClose}
                className="transition-all hover:scale-125 group"
              >
                <Cross1Icon className="w-6 h-6 text-[#A1A1AA] group-hover:text-[#DB0A3C]" />
              </button>
            </div>
          </div>
          <div className="w-full h-[0.0625rem] bg-gray-300" />
        </div>

        <div className="w-full h-full p-6 gap-6">
          <div className="w-full h-full flex flex-col gap-4">
            {errors.general && (
              <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-600 text-sm">
                  {t(errors.general)}
                </span>
              </div>
            )}
            <div className="w-full flex flex-col gap-2">
              <div
                className={`w-full flex flex-col h-12 border rounded-lg gap-2 justify-center pl-2 focus-within:ring-1 transition-all ${
                  errors.title
                    ? "border-red-300 focus-within:border-red-500 focus-within:ring-red-500"
                    : "border-gray-300 focus-within:border-[#167AFE] focus-within:ring-[#167AFE]"
                }`}
              >
                <input
                  type="text"
                  placeholder={t("title")}
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full h-full font-jakarta font-normal text-[0.875rem]/[1.375rem] text-[#00192C] focus:outline-none pl-2"
                />
              </div>
              {errors.title && (
                <span className="text-red-600 text-xs">{t(errors.title)}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="w-full h-[0.0625rem] bg-gray-300" />
          <div className="w-full h-[4.5rem] flex flex-row justify-between items-center px-4">
            <button
              onClick={handleClose}
              className="gap-2 items-center justify-center relative group"
              disabled={isCreating}
            >
              <span className="font-jakarta font-semibold text-sm/[1.375rem] text-[#167AFE]">
                {t("cancel")}
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-[0.1rem] bg-[#167AFE] transition-all duration-300 group-hover:w-full"></span>
            </button>

            <button
              onClick={handleSubmit}
              disabled={!title.trim() || isCreating}
              className={`px-4 transition-all hover:scale-105 rounded-[2rem] ${
                !title.trim() || isCreating ? "bg-gray-400" : "bg-[#167AFE]"
              } w-[8.875rem] flex flex-row h-[2.5rem] gap-1 items-center justify-center`}
            >
              <span className="font-jakarta font-semibold text-[0.875rem]/[1.375rem] text-white">
                {isCreating ? t("creating") : t("create")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Backdrop>
  );
};

CreateNewListMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
  parentRef: PropTypes.object,
};
