import Header from "../components/header";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { ListCard } from "../components/list-card";

export const loader = async ({ params }) => {
  const locale = params;
  return (
    locale
    );
};

export default function RadioLists() {
  const { locale } = useLoaderData();
  const { t } = useTranslation();

  return (
    <div>
      <Header locale={locale} alwaysBlue={true}/>
      <div className="w-full bg-white min-h-screen py-24 px-20 flex flex-col">
        
        <div className="w-full h-10 flex flex-row justify-between">
            <span className="text-[#00192C] text-xl font-jakarta font-semibold">
             {t("myRadioLists")}
            </span>
        </div>

        <div className="grid grid-cols-4 gap-6 py-4">
            <ListCard title="Top Hits" stationList={["Jazz FM", "Rock Nation", "Pop Central", "Classic Gold"]} />
            <ListCard title="Chill Vibes" stationList={["LoFi Beats", "Ambient Flow", "Smooth Jazz", "Cafe Lounge"]} />
            <ListCard title="World Music" stationList={["Samba Brasil", "K-Pop Wave", "Reggae Roots", "Afrobeat Live"]} />
            <ListCard title="Talk & News" stationList={["Global News", "Tech Talk", "Sports Hour", "Morning Brief"]} />
            <ListCard title="Electronic" stationList={["EDM Pulse", "Trance Zone", "House Party", "Synthwave"]} />
            <ListCard title="Indie" stationList={["Indie Rock", "Folk Stories", "Indie Pop", "Alt Nation"]} />
            <ListCard title="Classical" stationList={["Baroque FM", "Symphony Hall", "Opera House", "Piano Classics"]} />
            <ListCard title="Hip Hop" stationList={["Rap Central", "Old School", "Trap Beats", "Urban Flow"]} />
        </div>
      </div>
    </div>
  );
}
