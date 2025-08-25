import Header from "../components/header";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { ListCard } from "../components/list-card";
import { Link } from "@remix-run/react";
import { generateLocalizedRoute } from "../utils/generate-route";
import { authenticator } from "@pronto/auth/auth.server.js";
import { redirect, json } from "@remix-run/node";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { eq, and } from "drizzle-orm";
import { useEffect } from "react";
export const loader = async ({ params, request }) => {
  const user = await authenticator.isAuthenticated(request);
  const locale = params.lang;

  if (!user) {
    return redirect(`/${locale}/login`);
  }

  try {
    // Fetch all radio lists for the user that aren't deleted
    const userLists = await dbServer
      .select()
      .from(dbSchema.usersLists)
      .where(
        and(
          eq(dbSchema.usersLists.userId, user.id),
          eq(dbSchema.usersLists.isDeleted, 0),
        ),
      );

    // For each list, fetch the associated radios
    const listsWithRadios = await Promise.all(
      userLists.map(async (list) => {
        const listRadios = await dbServer
          .select({
            radio: dbSchema.radios,
          })
          .from(dbSchema.usersListsRadios)
          .leftJoin(
            dbSchema.radios,
            eq(dbSchema.usersListsRadios.radioId, dbSchema.radios.id),
          )
          .where(eq(dbSchema.usersListsRadios.usersListId, list.id));

        return {
          ...list,
          radios: listRadios.map((item) => item.radio).filter(Boolean),
        };
      }),
    );

    return json({
      user,
      locale,
      lists: listsWithRadios,
    });
  } catch (error) {
    console.error(error);
    return json({
      user,
      locale,
      lists: [],
    });
  }
};

export default function RadioLists() {
  const { locale, user, lists } = useLoaderData();
  const { t } = useTranslation();
  const revalidator = useRevalidator();

  // Revalidate data when the component mounts to ensure we have the latest lists
  useEffect(() => {
    revalidator.revalidate();
  }, [revalidator]);

  return (
    <div>
      <Header locale={locale} user={user} alwaysBlue={true} />
      <div className="w-full bg-white min-h-screen py-24 px-20 flex flex-col items-center">
        {lists.length === 0 ? (
          <div className="flex flex-col w-[39.5rem] h-[19.875rem] my-auto items-center justify-center gap-8 mx-auto">
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
              className="w-[9.75rem] h-10 rounded-full bg-[#167AFE] flex items-center justify-center transition-all duration-200 hover:scale-105 hover:bg-[#1569d6]"
            >
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
              {lists.map((list) => (
                <ListCard
                  key={list.id}
                  locale={locale}
                  title={list.userListName}
                  description={list.userListDescription}
                  id={list.id}
                  stationList={list.radios || []}
                  user={user}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
