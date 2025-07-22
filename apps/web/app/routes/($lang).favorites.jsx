import { useTranslation } from "react-i18next";
import Header from "../components/header";
import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { generateLocalizedRoute } from "../utils/generate-route";
import RadioCard from "../components/radio-card";
import { ListCard } from "../components/list-card";
import { CountryCard } from "../components/country-card";
import { authenticator } from "@pronto/auth/auth.server.js";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { eq, and } from "drizzle-orm";
import { redirect, json } from "@remix-run/node";
import { useState } from "react";
import { RemoveAllFavorites } from "../components/pop-ups/remove-all-favs-menu";

export const loader = async ({ params, request }) => {
  const user = await authenticator.isAuthenticated(request);
  const locale = params.lang;

  if (!user) {
    return redirect(`/${locale}/login`);
  }

  // Fetch all favorites for the current user
  const userFavorites = await dbServer
    .select()
    .from(dbSchema.favorites)
    .where(eq(dbSchema.favorites.userId, user.id));
  // Group favorites by target type
  const radioFavorites = userFavorites.filter(
    (fav) => fav.targetType === "radio",
  );
  const listFavorites = userFavorites.filter(
    (fav) => fav.targetType === "list",
  );
  const countryFavorites = userFavorites.filter(
    (fav) => fav.targetType === "country",
  );

  const radioArr = [];
  if (radioFavorites.length > 0) {
    const radioIds = radioFavorites.map((fav) => fav.targetId);
    const radioStations = await Promise.all(
      radioIds.map(async (id) => {
        const station = await dbServer
          .select()
          .from(dbSchema.radios)
          .where(eq(dbSchema.radios.id, id))
          .limit(1);

        return station[0]
          ? {
              stationuuid: station[0].id,
              name: station[0].radioName,
              url: station[0].url,
              favicon: station[0].favicon,
              country: station[0].countryId,
              // These fields might not be available in your DB schema
              // but are expected by the RadioCard component
              tags: station[0].radioTags
                ? JSON.parse(station[0].radioTags)
                : [],
              clickcount: 0,
              votes: 0,
            }
          : null;
      }),
    );

    radioArr.push(...radioStations.filter(Boolean));
  }

  // Fetch user lists
  const radioListArr = [];
  if (listFavorites.length > 0) {
    const listIds = listFavorites.map((fav) => fav.targetId);
    const userLists = await Promise.all(
      listIds.map(async (id) => {
        const list = await dbServer
          .select()
          .from(dbSchema.usersLists)
          .where(eq(dbSchema.usersLists.id, id))
          .limit(1);

        if (!list[0]) return null;

        // Here you would fetch the stations in this list
        // This is a simplified version
        return {
          listId: list[0].id,
          name: list[0].userListName,
          stationList: [], // You'd populate this with actual stations
        };
      }),
    );

    radioListArr.push(...userLists.filter(Boolean));
  }

  // Fetch countries
  const countryArr = [];
  if (countryFavorites.length > 0) {
    const countryIds = countryFavorites.map((fav) => fav.targetId);

    // Use a single query with inArray instead of multiple individual queries
    const { inArray } = await import("drizzle-orm");
    const countries = await dbServer
      .select()
      .from(dbSchema.countries)
      .where(inArray(dbSchema.countries.iso, countryIds));

    // Map the countries to the expected format
    countryArr.push(
      ...countries.map((country) => ({
        name: country.countryName,
        countryCode: country.iso,
      })),
    );
  }

  return {
    locale,
    user,
    radioArr,
    radioListArr,
    countryArr,
  };
};

// Action to handle "Remove All" for each section
export const action = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request);
  const locale = params.lang;

  if (!user) {
    return redirect(`/${locale}/login`);
  }

  const formData = await request.formData();
  const removeType = formData.get("removeType"); // "radio", "list", "country"

  if (!["radio", "list", "country"].includes(removeType)) {
    return json({ error: "Invalid type" }, { status: 400 });
  }

  // Remove all favorites of the specified type for the user
  await dbServer
    .delete(dbSchema.favorites)
    .where(
      and(
        eq(dbSchema.favorites.userId, user.id),
        eq(dbSchema.favorites.targetType, removeType),
      ),
    );

  // Redirect back to favorites page
  return redirect(`/${locale}/favorites`);
};

export default function FavoritesPage() {
  const { t } = useTranslation();
  const {
    locale,
    user,
    radioArr = [],
    radioListArr = [],
    countryArr = [],
  } = useLoaderData();
  const [showModal, setShowModal] = useState(false);
  const [removeType, setRemoveType] = useState(null);
  const [formRef, setFormRef] = useState(null);

  return (
    <div>
      <Header locale={locale} user={user} alwaysBlue={true} />
      <div className="w-full bg-white min-h-screen py-24 px-20 flex flex-col">
        {radioListArr.length === 0 &&
        radioArr.length === 0 &&
        countryArr.length === 0 ? (
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
                className="w-[9.75rem] h-10 rounded-full mt-8 bg-[#167AFE] flex items-center justify-center transition-all duration-200 hover:scale-105 hover:bg-[#1569d6]"
              >
                <span className="font-jakarta text-white text-sm/[1.375rem] font-semibold text-center">
                  {t("discoverStations")}
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {radioArr && radioArr.length > 0 && (
              <div className="w-full flex flex-col gap-6 mb-[3rem]">
                <div className="w-full h-10 flex flex-row justify-between">
                  <span className="text-[#00192C] text-xl font-jakarta font-semibold">
                    {t("favStations")}
                  </span>
                  <form method="post" ref={(el) => el && setFormRef(el)}>
                    <input type="hidden" name="removeType" value="radio" />
                    <button
                      type="button"
                      onClick={() => {
                        setRemoveType("station");
                        setShowModal(true);
                      }}
                      className="border-[#BDC0C2] border h-full hover:scale-105 transition-all rounded-full flex items-center justify-center py-4 gap-1 px-6"
                    >
                      <span className="font-jakarta text-[#167AFE] text-sm/[1.375rem] font-semibold text-center whitespace-nowrap">
                        {t("removeAllFavs")}
                      </span>
                    </button>
                  </form>
                </div>
                <div className="w-full h-auto flex-row grid grid-cols-4 gap-6">
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
                      user={user}
                    />
                  ))}
                </div>
              </div>
            )}
            {radioListArr && radioListArr.length > 0 && (
              <div className="w-full flex flex-col gap-6 mb-[3rem]">
                <div className="w-full h-10 flex flex-row justify-between">
                  <span className="text-[#00192C] text-xl font-jakarta font-semibold">
                    {t("favLists")}
                  </span>
                  <form method="post" ref={(el) => el && setFormRef(el)}>
                    <input type="hidden" name="removeType" value="list" />
                    <button
                      type="button"
                      onClick={() => {
                        setRemoveType("list");
                        setShowModal(true);
                      }}
                      className="border-[#BDC0C2] border h-full hover:scale-105 transition-all rounded-full flex items-center justify-center py-4 gap-1 px-6"
                    >
                      <span className="font-jakarta text-[#167AFE] text-sm/[1.375rem] font-semibold text-center whitespace-nowrap">
                        {t("removeAllFavs")}
                      </span>
                    </button>
                  </form>
                </div>
                <div className="w-full h-[8.75rem] flex flex-row gap-6">
                  {radioListArr.map((list, idx) => (
                    <ListCard
                      key={list.listId || idx}
                      title={list.name}
                      stationList={list.stationList}
                      locale={locale}
                      listId={list.listId}
                      user={user}
                    />
                  ))}
                </div>
              </div>
            )}
            {countryArr && countryArr.length > 0 && (
              <div className="w-full flex flex-col gap-6 mb-[3rem]">
                <div className="w-full h-10 flex flex-row justify-between">
                  <span className="text-[#00192C] text-xl font-jakarta font-semibold">
                    {t("favCountries")}
                  </span>
                  <form method="post" ref={(el) => el && setFormRef(el)}>
                    <input type="hidden" name="removeType" value="country" />
                    <button
                      type="button"
                      onClick={() => {
                        setRemoveType("country");
                        setShowModal(true);
                      }}
                      className="border-[#BDC0C2] border h-full hover:scale-105 transition-all rounded-full flex items-center justify-center py-4 gap-1 px-6"
                    >
                      <span className="font-jakarta text-[#167AFE] text-sm/[1.375rem] font-semibold text-center whitespace-nowrap">
                        {t("removeAllFavs")}
                      </span>
                    </button>
                  </form>
                </div>
                <div className="w-full h-auto flex-row grid grid-cols-4 gap-6">
                  {countryArr.map((country, idx) => (
                    <CountryCard
                      key={country.name || idx}
                      name={country.name}
                      countryCode={country.countryCode}
                      locale={locale}
                      index={idx}
                      user={user}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <RemoveAllFavorites
        type={removeType}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          if (formRef) {
            formRef.submit();
          }
          setShowModal(false);
        }}
      />
    </div>
  );
}
