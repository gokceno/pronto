import Header from "../components/header";
import { useTranslation } from "react-i18next";
import SearchBar from "../components/search-bar";
import { useLoaderData } from "@remix-run/react";
import { RadioBrowserApi } from 'radio-browser-api';
import React from 'react';
import SearchSuggestions from "../components/search-suggestions";


export const loader = async ({ params }) => {

    const api = new RadioBrowserApi(process.env.APP_TITLE);  
    const stations = await api.searchStations({
      order: "clickcount",
      reverse: true,
      limit: 6, 
      hideBroken: true,
    });

  return {
    locale: params.lang,
    stations
  };
};

export default function SearchPage() {
  const { t } = useTranslation();
  const { locale, stations } = useLoaderData();
  const stationList = stations.map(({ id, name, url, country, clickCount, votes }) => ({
    id,
    name,
    url,
    country,
    clickCount,
    votes,
  }));

  return (
    <>
      <Header alwaysBlue={true} locale={locale} />
      <div className="w-full bg-white min-h-[60rem] py-24 px-20 flex flex-col items-center justify-start">
        <div className="w-[40rem] h-[10.5rem] gap-8 flex flex-col text-center">
          <div className="w-full h-20">
            <span className="font-jakarta text-[2rem] font-bold whitespace-pre-line">
              {t("listenWhat")}
            </span>
          </div>

          <SearchBar locale={locale} />
        </div>

        <SearchSuggestions
          t={t}
          locale={locale}
          stations={stations}
          stationList={stationList}
        />
      </div>
    </>
  );
}
