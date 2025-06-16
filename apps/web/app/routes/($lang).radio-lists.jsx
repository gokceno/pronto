import Header from "../components/header";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { ListCard } from "../components/list-card";
import { Link } from "@remix-run/react";
import { generateLocalizedRoute } from "../utils/generate-route";
import { authenticator } from "@pronto/auth/auth.server.js";

export const loader = async ({ params, request }) => {
  const user = await authenticator.isAuthenticated(request);

  const locale = params;
  return (
    user,
    locale
    );
};

export default function RadioLists() {
  const { locale, user } = useLoaderData();
  const { t } = useTranslation();

  const listData = [
    { title: "Top Hits", stationList: ["Jazz FM", "Rock Nation", "Pop Central", "Classic Gold"] },
    { title: "Chill Vibes", stationList: ["LoFi Beats", "Ambient Flow", "Smooth Jazz", "Cafe Lounge"] },
    { title: "World Music", stationList: ["Samba Brasil", "K-Pop Wave", "Reggae Roots", "Afrobeat Live"] },
    { title: "Talk & News", stationList: ["Global News", "Tech Talk", "Sports Hour", "Morning Brief"] },
    { title: "Electronic", stationList: ["EDM Pulse", "Trance Zone", "House Party", "Synthwave"] },
    { title: "Indie", stationList: ["Indie Rock", "Folk Stories", "Indie Pop", "Alt Nation"] },
    { title: "Classical", stationList: ["Baroque FM", "Symphony Hall", "Opera House", "Piano Classics"] },
    { title: "Hip Hop", stationList: ["Rap Central", "Old School", "Trap Beats", "Urban Flow"] },
  ];

  return (
    <div>
      <Header locale={locale} userIconURL={user.avatar} alwaysBlue={true}/>
      <div className="w-full bg-white min-h-screen py-24 px-20 flex flex-col items-center">
        
        {listData.length === 0 ? (
          <div className="flex flex-col w-[39.5rem] h-[19.875rem] items-center justify-center gap-8 mx-auto">
            <img
              src="/assets/empty-list.svg"
              alt="empty list"
              className="w-30 h-30"
            />

            <div className="flex flex-col w-[33.5rem] h-[5.875rem] items-center justify-center text-center gap-4">
              <span className="text-[#167AFE] text-xl font-jakarta font-semibold">
                {t("emptyList")}
              </span>

              <span className="font-jakarta text-[#02141C] text-sm/[1.375rem] font-normal whitespace-pre-line">
                {t("emptyListHeader")}
              </span>
            </div>

            <Link 
              to={generateLocalizedRoute(locale, "/search")}
              className="w-[9.75rem] h-10 rounded-full bg-[#167AFE] flex items-center justify-center transition-all duration-200 hover:scale-105 hover:bg-[#1569d6]">
                <span className="font-jakarta text-white text-sm/[1.375rem] font-semibold text-center">
                  {t("discoverStations")}
                </span>
            </Link>

          </div>
        ) : (
          <div>
            <div className="w-full h-10 flex flex-row justify-between">
                <span className="text-[#00192C] text-xl font-jakarta font-semibold">
                {t("myRadioLists")}
                </span>
            </div>
            <div className="grid grid-cols-4 gap-6 py-4">
              {listData.map((list, idx) => (
                <ListCard key={list.title + idx} locale={locale} title={list.title} stationList={list.stationList} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
