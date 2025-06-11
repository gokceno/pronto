import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/header';
import { useLoaderData } from "@remix-run/react";
import { Link } from '@remix-run/react';
import { generateLocalizedRoute } from '../utils/generate-route';
import RadioCard from '../components/radio-card';
import { GenreCard } from '../components/genre-card';
import { ListCard } from '../components/list-card';
import { CountryCard } from '../components/country-card';

export const loader = async ({ params }) => {
    const locale = params;
    return (
      locale
      );
  };

export default function FavoritesPage({radioListArr=[], radioArr=[], countryArr=[]}) {
  const { t } = useTranslation();
  const { locale } = useLoaderData();

  return (
    <div>
      <Header locale={locale} alwaysBlue={true}/>
      <div className="w-full bg-white min-h-screen py-24 px-20 flex flex-col">
        {(radioListArr.length === 0 && radioArr.length === 0 && countryArr.length === 0) ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col w-[39.5rem] h-[23.625rem] items-center justify-center gap-8">
              <img
                src="/assets/fav.svg"
                alt="empty list"
                className="w-30 h-30"
              />

              <div className="flex flex-col w-[33.5rem] h-[5.875rem] items-center justify-center text-center gap-4">
                <span className="text-[#167AFE] text-xl font-jakarta font-semibold">
                  {t("noFav")}
                </span>

                <span className="font-jakarta text-[#02141C] text-sm/[1.375rem] font-normal whitespace-pre-line">
                  {t("noFavUpperHeader")}
                </span>

                <span className="font-jakarta text-[#02141C] text-sm/[1.375rem] font-normal whitespace-pre-line">
                  {t("noFavLowerHeader")}
                </span>
              </div>

              <Link 
                to={generateLocalizedRoute(locale, "/search")}
                className="w-[9.75rem] h-10 rounded-full mt-8 bg-[#167AFE] flex items-center justify-center transition-all duration-200 hover:scale-105 hover:bg-[#1569d6]">
                  <span className="font-jakarta text-white text-sm/[1.375rem] font-semibold text-center">
                    {t("discoverStations")}
                  </span>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {radioArr && radioArr.length > 0 && (
              <div className='w-full h-[17.875rem] flex flex-col gap-6'>
                <div className="w-full h-10 flex flex-row justify-between">
                    <span className="text-[#00192C] text-xl font-jakarta font-semibold">
                          {t("favStations")}
                    </span>

                    <button className='border-[#BDC0C2] border h-full hover:scale-105 transition-all rounded-full flex items-center justify-center py-4 gap-1 px-6'>
                      <span className='font-jakarta text-[#167AFE] text-sm/[1.375rem] font-semibold text-center whitespace-nowrap'>
                          {t("removeAllFavs")}
                      </span>
                    </button>
                </div>
                <div className="w-full h-[13.875rem] flex flex-row gap-6">
                    {radioArr.map((radio, idx) => (
                        <RadioCard
                        key={radio.stationuuid || idx}
                        stationuuid={radio.stationuuid}
                        name={radio.name}
                        tags={radio.tags || []}
                        clickcount={radio.clickcount}
                        votes={radio.votes}
                        url={radio.url}
                        country={radio.country}
                        locale={locale}
                        stationList={radioArr}
                        favicon={radio.favicon}
                        />
                    ))}
                </div>
              </div>
            )}
            {radioListArr && radioListArr.length > 0 && (
              <div className='w-full h-[17.875rem] flex flex-col gap-6'>
                <div className="w-full h-10 flex flex-row justify-between">
                    <span className="text-[#00192C] text-xl font-jakarta font-semibold">
                    {t("favLists")}
                    </span>
                    <button className='border-[#BDC0C2] border h-full hover:scale-105 transition-all rounded-full flex items-center justify-center py-4 gap-1 px-6'>
                      <span className='font-jakarta text-[#167AFE] text-sm/[1.375rem] font-semibold text-center whitespace-nowrap'>
                          {t("removeAllFavs")}
                      </span>
                    </button>
                </div>
                <div className="w-full h-[8.75rem] flex flex-row gap-6">
                    {radioListArr.map((list, idx) => (
                        <ListCard
                          key={list.listId || idx}
                          title={list.name}
                          stationList={list.stationList}
                          locale={locale}
                          listId={list.listId}
                        />
                    ))}
                </div>
              </div>
            )}
            {countryArr && countryArr.length > 0 && (
              <div className='w-full h-[17.875rem] flex flex-col gap-6'>
                <div className="w-full h-10 flex flex-row justify-between">
                    <span className="text-[#00192C] text-xl font-jakarta font-semibold">
                    {t("favCountries")}
                    </span>
                    <button className='border-[#BDC0C2] border h-full hover:scale-105 transition-all rounded-full flex items-center justify-center py-4 gap-1 px-6'>
                      <span className='font-jakarta text-[#167AFE] text-sm/[1.375rem] font-semibold text-center whitespace-nowrap'>
                          {t("removeAllFavs")}
                      </span>
                    </button>
                </div>
                <div className="w-full h-[8.75rem] flex flex-row gap-6">
                    {countryArr.map((country, idx) => (
                        <CountryCard
                        key={country.name || idx}
                        name={country.name}
                        countryCode={country.countryCode}
                        locale={locale}
                        index={idx}
                        />
                    ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
