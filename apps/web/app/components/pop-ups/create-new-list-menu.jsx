import { Cross1Icon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useState } from "react";
import PropTypes from "prop-types";
import React from "react";

export const CreateNewListMenu = ({ onClose }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const fetcher = useFetcher();
  const navigate = useNavigate();

  // Handle form submission state
  React.useEffect(() => {
    if (fetcher.state === "submitting") {
      setIsCreating(true);
    } else if (
      fetcher.state === "idle" &&
      fetcher.data &&
      fetcher.data.success
    ) {
      setIsCreating(false);
      onClose();
      navigate("/radio-lists");
    } else if (fetcher.state === "idle" && isCreating) {
      setIsCreating(false);
    }
  }, [fetcher.state, fetcher.data, navigate, onClose, isCreating]);

  return (
    <div className="flex flex-col w-[25.6875rem] h-[23.125rem] rounded-xl justify-between bg-white">
      <div className="flex flex-col">
        <div className="w-full h-[5rem] gap-4 p-6 flex flex-row items-center justify-between">
          <span className="font-jakarta font-semibold text-[#00192C] text-[1.25rem]/[1.75rem]">
            {t("newList")}
          </span>

          <div className="h-8 w-8 flex rounded-full justify-end">
            <button
              onClick={onClose}
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
          <div className="w-full flex flex-col h-12 border border-gray-300 rounded-lg gap-2 justify-center pl-2 focus-within:border-[#167AFE] focus-within:ring-1 focus-within:ring-[#167AFE] transition-all">
            <input
              type="text"
              placeholder={t("title")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-full font-jakarta font-normal text-[0.875rem]/[1.375rem] text-[#00192C] focus:outline-none pl-2"
              required
            />
          </div>

          <div className="w-full flex flex-col h-[6.625rem] border border-gray-300 rounded-lg gap-2 pt-2 pl-2 focus-within:border-[#167AFE] focus-within:ring-1 focus-within:ring-[#167AFE] transition-all">
            <textarea
              placeholder={t("desc")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-full font-jakarta font-normal text-[0.875rem]/[1.375rem] text-[#00192C] focus:outline-none resize-none pl-2"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="w-full h-[0.0625rem] bg-gray-300" />
        <div className="w-full h-[4.5rem] flex flex-row justify-between items-center px-4">
          <button
            onClick={onClose}
            className="gap-2 items-center justify-center relative group"
            disabled={isCreating}
          >
            <span className="font-jakarta font-semibold text-sm/[1.375rem] text-[#167AFE]">
              {t("cancel")}
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-[0.1rem] bg-[#167AFE] transition-all duration-300 group-hover:w-full"></span>
          </button>

          <button
            onClick={() => {
              if (!title.trim()) return;

              setIsCreating(true);
              fetcher.submit(
                {
                  userListName: title,
                  userListDescription: description,
                },
                {
                  method: "post",
                  action: "/api/radio-lists?operation=create-list",
                  encType: "application/json",
                },
              );
            }}
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
  );
};

CreateNewListMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
};
