import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { GenreCard } from "../components/genre-card.jsx";
import { CountryCard } from "../components/country-card.jsx";
import SearchBar from "../components/search-bar.jsx";
import SearchBarTabs from "../components/search-bar-tabs.jsx";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { generateLocalizedRoute } from "../utils/generate-route.jsx";
import Header from "../components/header.jsx";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { count, eq, desc } from "drizzle-orm";
import { authenticator } from "@pronto/auth/auth.server";
import { ListCard } from "../components/list-card";
import React, { useRef, useState } from "react";

export const loader = async ({ params, request }) => {
  const user = await authenticator.isAuthenticated(request);

  const radiosTags = await dbServer
    .select({ radioTags: dbSchema.radios.radioTags })
    .from(dbSchema.radios)
    .where(eq(dbSchema.radios.isDeleted, 0));

  const tagCounts = {};
  radiosTags.forEach(({ radioTags }) => {
    let tags = [];
    try {
      tags = JSON.parse(radioTags);
    } catch (e) {
      console.error("Error parsing radioTags:", e);
    }
    tags.forEach((tag) => {
      if (!tag) return;
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const genres = Object.entries(tagCounts)
    .map(([name, stationcount]) => ({ name, stationcount }))
    .sort((a, b) => b.stationcount - a.stationcount);

  const stations = await dbServer
    .select({
      id: dbSchema.radios.id,
      name: dbSchema.radios.radioName,
      url: dbSchema.radios.url,
      favicon: dbSchema.radios.favicon,
      country: dbSchema.radios.countryId,
    })
    .from(dbSchema.radios)
    .where(eq(dbSchema.radios.isDeleted, 0))
    .limit(4);

  const stationCount = count(dbSchema.radios.id).as("stationCount");
  const countries = await dbServer
    .select({
      countryName: dbSchema.countries.countryName,
      iso: dbSchema.countries.iso,
      stationCount,
    })
    .from(dbSchema.countries)
    .where(eq(dbSchema.countries.isDeleted, 0))
    .leftJoin(
      dbSchema.radios,
      eq(dbSchema.radios.countryId, dbSchema.countries.id),
    )
    .groupBy(dbSchema.countries.id)
    .orderBy(desc(stationCount));

  return {
    genres,
    countries,
    stations,
    locale: params.lang,
    user,
  };
};

export default function Homepage() {
  const { t } = useTranslation();
  const { genres, countries, locale, stations, user } = useLoaderData();
  const stationList = stations.map(({ id, name, url, country }) => ({
    id,
    name,
    url,
    country,
    votes: 0,
    clickCount: 0,
  }));

  const listData = [];

  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);
  const itemCount = listData.length;

  const scrollTo = (direction) => {
    console.log("click");
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.scrollWidth / itemCount;

      let newSlide;
      if (direction === "left") {
        newSlide = currentSlide === 0 ? itemCount - 1 : currentSlide - 1;
      } else {
        newSlide = currentSlide === itemCount - 1 ? 0 : currentSlide + 1;
      }

      setCurrentSlide(newSlide);
      container.scrollTo({
        left: newSlide * itemWidth,
        behavior: "smooth",
      });
    }
  };

  const BACKGROUND_CLASSES = {
    countries: "bg-blue-100",
    genres: "bg-white",
    default: "",
  };

  return (
    <>
      <Header
        locale={locale}
        user={user}
        isStatic={false}
        className="flex-shrink-0"
      />
      <div className="h-[25rem] w-full bg-[url('/assets/search_bar_bg.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
        <div className="w-[40rem] h-[14.5rem] flex flex-col mt-10 gap-8">
          <div className="text-center">
            <span className="text-white font-jakarta text-3xl font-bold whitespace-pre-line">
              {t("searchHeader")}
            </span>
          </div>
          <SearchBar
            locale={locale}
            expandable={true}
            stationList={stationList}
            stations={stations}
            user={user}
          />
          <SearchBarTabs locale={locale} />
        </div>
      </div>
      <div className={`p-6 sm:px-6 lg:px-8 ${BACKGROUND_CLASSES.genres}`}>
        <div className="mx-auto max-w-7xl ">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl/[1.75rem] text-[#00192C] font-jakarta font-semibold">
              {t("genres")}
            </span>
            <Link
              to={generateLocalizedRoute(locale, "/genres")}
              className="text-blue-500 border font-bold border-gray-400 rounded-full px-4 py-2 transition-all hover:bg-[#167AFE] hover:text-white hover:scale-105"
            >
              {t("showAll")}
            </Link>
          </div>
          <div
            className="grid grid-cols-1 gap-5 justify-items-center
                          sm:grid-cols-2
                          lg:grid-cols-4"
          >
            {genres.slice(0, 16).map((genre, index) => (
              <GenreCard
                key={genre.name}
                name={genre.name}
                stationcount={genre.stationcount}
                locale={locale}
                index={index}
              />
            ))}
          </div>
          <div className="h-5" />
        </div>
      </div>

      {!user ? (
        <div
          className="min-h-[25rem] w-full p-20 flex flex-col items-center text-center justify-center bg-[url('/assets/banner.png')]
            bg-cover bg-center bg-no-repeat"
        >
          <span className="text-[2rem]/[2.5rem] text-[#FFFFFF] font-jakarta font-semibold mb-2">
            {t("bannerTitle")}
          </span>
          <span className="mb-10 whitespace-pre-line text-[1.25rem]/[1.75rem] text-[#FFFFFF] font-jakarta font-normal">
            {t("bannerDescription")}
          </span>
          <Link
            to={generateLocalizedRoute(locale, "/login")}
            className="bg-[#E6E953] w-[16.5rem] h-[3.5rem]
                  flex items-center justify-center
                  text-[#00192C] text-[1rem]/[1.5rem] font-jakarta font-semibold rounded-full transition-all hover:scale-105"
          >
            {t("signIn")}
          </Link>
        </div>
      ) : (
        Array.isArray(listData) &&
        listData.length > 0 && (
          <div className="flex flex-col items-start gap-[1.5rem] p-[5rem] w-full min-h-[21.5rem] bg-[#00192C]">
            <div className="flex w-full h-[2.5rem] justify-between items-center">
              <span className="font-jakarta text-[1.25rem]/[1.75rem] font-semibold text-[#FFF]">
                {t("myRadioLists")}
              </span>
              <div className="flex flex-row gap-4 w-[15.3rem] h-[2.5rem] items-start">
                <Link
                  to={generateLocalizedRoute(locale, "/radio-lists")}
                  className="flex w-[7.31rem] h-[2.5rem] rounded-full p-4 border-2 items-center text-[#FFF] hover:text-[#00192C]
                justify-center border-[#BDC0C2] hover:bg-[#FFF] hover:border-[#FFF] transition-colors"
                >
                  <span className="font-jakarta text-[0.875rem]/[1.375rem] font-semibold ">
                    {t("showAll")}
                  </span>
                </Link>

                <button
                  className="w-[2.5rem] h-[2.5rem] rounded-full border-2 border-[#BDC0C2] items-center justify-center transition-colors hover:bg-[#FFF] hover:border-[#FFF] group"
                  onClick={() => scrollTo("left")}
                  type="button"
                >
                  <ChevronLeftIcon className="w-[1.5rem] h-[1.5rem] text-[#FFF] ml-1.5 group-hover:text-[#00192C]" />
                </button>

                <button
                  className="w-[2.5rem] h-[2.5rem] rounded-full border-2 border-[#BDC0C2] items-center justify-center transition-colors hover:bg-[#FFF] hover:border-[#FFF] group"
                  onClick={() => scrollTo("right")}
                  type="button"
                >
                  <ChevronRightIcon className="w-[1.5rem] h-[1.5rem] text-[#FFF] ml-1.5 group-hover:text-[#00192C]" />
                </button>
              </div>
            </div>
            <div className="overflow-hidden hidden md:block">
              <div
                ref={scrollContainerRef}
                className="flex gap-6 transition-transform duration-300 ease-in-out md:snap-none snap-x snap-mandatory"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  transform: `translateX(-${currentSlide * 20.375}rem)`,
                  overscrollBehavior: "contain",
                  WebkitOverflowScrolling: "touch",
                  scrollSnapType: "x mandatory",
                  scrollBehavior: "smooth",
                }}
              >
                {listData.map((list, idx) => (
                  <ListCard
                    key={list.title + idx}
                    locale={locale}
                    title={list.title}
                    stationList={list.stationList}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      )}
      <div
        className={`p-6 pb-12 sm:px-6 lg:px-8 ${BACKGROUND_CLASSES.countries}`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl/[1.75rem] text-[#00192C] font-jakarta font-semibold">
              {t("countries")}
            </span>
            <Link
              to={generateLocalizedRoute(locale, "/countries")}
              className="text-blue-500 border font-bold border-gray-400 rounded-full px-4 py-2 transition-all hover:bg-[#167AFE] hover:text-white hover:scale-105"
            >
              {t("showAll")}
            </Link>
          </div>
          <div
            className="grid grid-cols-1 gap-5 justify-items-center
                            sm:grid-cols-2
                            lg:grid-cols-4"
          >
            {countries
              .slice(0, 12)
              .map(({ countryName, stationCount, iso }) => (
                <CountryCard
                  key={iso}
                  name={countryName}
                  countryCode={iso}
                  stationCount={stationCount}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
