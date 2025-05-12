import Header from "../components/header";
import { useTranslation } from "react-i18next";
import SearchBar from "../components/search-bar";
import { TrashIcon } from "@radix-ui/react-icons";
import { generateLocalizedRoute } from "../utils/generate-route";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import StationCard from "../components/station-card";
import { RadioBrowserApi } from 'radio-browser-api'

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
  const {locale, stations} = useLoaderData();
  const stationList = stations.map(({ id, name, url, country, clickCount, votes }) => ({
    id,
    name,
    url,
    country,
    clickCount,
    votes
  }));

  return (
    <>
      <Header alwaysBlue={true} />
      <div className="w-full bg-white min-h-[60rem] py-24 px-20 flex flex-col items-center justify-start">
        <div className="w-[40rem] h-[10.5rem] gap-8 flex flex-col text-center">
            <div className="w-full h-20">
                <span className="font-jakarta text-[2rem] font-bold whitespace-pre-line">
                    {t("listenWhat")}
                </span>
            </div>

            <SearchBar/>
        </div>

        <div className="w-full md:px-[15rem] py-6 gap-10 flex flex-col justify-start">
            <div className="w-[39.5rem] h-[12rem] gap-3 flex flex-col">
                <div className="w-full h-10 gap-3 flex flex-row items-center">
                    <span className="font-jakarta text-[1rem]/[1.5rem] font-bold text-[#00192C]">
                        {t("latestSearch")}
                    </span>

                    <span className="font-jakarta text-sm/[1.375rem] mt-0.5 font-semibold text-[#167AFE] relative group cursor-pointer">
                        {t("deleteAll")}
                        <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-[#167AFE] transition-all duration-300 group-hover:w-full"></span>
                    </span>
                </div>

                <div className="w-full h-[8.75rem] flex flex-col gap-2">
                    <Link 
                    to={generateLocalizedRoute(locale, `/details/genre/${encodeURIComponent("Pop")}`)}
                    className="w-full h-[2rem] py-1 gap-1 flex flex-row items-center hover:bg-[#E8F2FF]
                            hover:rounded-lg transition-all">
                        <TrashIcon className="text-[#167AFE] w-6 h-6 hover:scale-110 hover:text-[#DB0A3C] transition-all"/>
                        <div
                            
                            className="font-jakarta font-medium text-sm/[1.375rem] text-[#02141C]"
                        >
                            POP
                        </div>
                    </Link>
                </div>

                <div className="w-[25.5rem] h-[3rem] gap-3 flex flex-col">
                    <div className="w-full h-6 flex flex-row">
                        <span className="font-jakarta font-bold text-[1rem]/[1.5rem] text-[#00192C]">
                            {t("hotTags")}
                        </span>
                    </div>   

                    <div className="w-full flex flex-row h-[2rem] gap-2">
                        {["Pop", "Jazz", "R&B", "Hip-Pop", "Dance", "Indie"].map((genre) => (
                            <Link
                                to={generateLocalizedRoute(locale, `/details/genre/${encodeURIComponent(genre)}`)}
                                key={genre}
                                className={`min-w-[3.25rem] h-[2rem] px-1 justify-center items-center text-center rounded-lg border border-[#94C2FF] bg-white transition-all hover:scale-105 hover:bg-[#E8F2FF]`}
                            >
                                <span className="font-jakarta font-semibold text-sm/[1.375rem] text-[#1057B4]">
                                    {genre}
                                </span>
                            </Link>
                        ))}
                    </div> 
                </div> 

                <div className="w-[60rem] min-h-[13.75rem] gap-3 flex flex-col mt-10 sm:w-[39.5rem] sm:min-h-[20.5rem]">
                    <div className="w-full h-6 flex flex-row">
                        <span className="font-jakarta font-bold text-[1rem]/[1.5rem] text-[#00192C]">
                            {t("hotStations")}
                        </span>
                    </div>
                    
                    <div className="w-full min-h-[11.5rem] grid grid-cols-3 grid-rows-2 gap-6 sm:grid-cols-2 sm:grid-rows-3">
                        {stations.map(({
                                id,
                                name,
                                tags,
                                clickCount,
                                votes,
                                language,
                                url,
                                country,
                                }, index) => (
                            <StationCard
                                key={id ? `station-${id}` : `station-index-${index}`}
                                stationuuid={id}
                                name={name}
                                tags={tags || []}
                                clickCount={clickCount}
                                votes={votes}
                                language={language}
                                url={url}
                                country={country}
                                locale={locale}
                                stationList={stationList} 
                            />
                        ))}
                    </div> 

                </div>

            </div>
        </div>
            <div/>
      </div>
    </>
  );
}
