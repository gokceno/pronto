import { useTranslation } from "react-i18next";
import Header from "../components/header.jsx";
import { useLoaderData } from "@remix-run/react";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { eq } from "drizzle-orm";
import { authenticator } from "@pronto/auth/auth.server";
import { redirect } from "@remix-run/node";

export const loader = async ({ params, request }) => {
  const { lang } = params;
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect(`/${lang}/login`);
  }

    // Fetch user info from DB
    const dbUser = await dbServer
    .select()
    .from(dbSchema.users)
    .where(eq(dbSchema.users.id, user.id))
    .get();
  
  return {
    locale: lang,
    user: dbUser

  };
};


export default function Profile() {
  const { t } = useTranslation();
  const { locale, user } = useLoaderData();

  return (
    <div>
        
        <Header locale={locale} alwaysBlue={true} className="flex-shrink-0" />
        <div className="w-full min-h-screen py-20 pt-16 gap-10 bg-white flex items-center justify-center">
            <div className="flex flex-col bg-white w-[31.3125rem] h-auto gap-6 justify-start">
            <div className="flex flex-row gap-4 w-[20.6875rem] h-[4rem] items-center">
                {user?.avatar ? (
                <img
                    src={user.avatar}
                    alt="User avatar"
                    className="w-16 h-16 rounded-full object-cover"
                />
                ) : (
                <div className="w-16 h-16 rounded-full bg-gray-400" />
                )}
                <span className="font-jakarta font-semibold text-[1.5rem]/[2rem] text-[#00192C]">
                {t("welcome", { username: user?.userName?.split(" ")[0] || "User" })}
                </span>
            </div>
                

                <div className="flex flex-col gap-1 w-[29rem] h-[4.75rem]">
                    <span className="font-jakarta font-semibold text-[1.25rem]/[1.75rem] text-[#00192C]">
                    {t("userInfo")}
                    </span>
                    <span className="font-jakarta font-normal text-[0.875rem]/[1.375rem] text-[#00192C]">
                    {t("profileHeader")}
                    </span>
                </div>

                <div className="w-full h-[0.0625rem] bg-gray-200"></div>

                
                <div className="flex flex-col w-[31.3125rem] h-[15.25rem] gap-6">
                    <div className="w-full h-[4.875rem] gap-4 flex flex-row">
                        <div className="h-full w-[15.15625rem] gap-2 flex flex-col">
                            <span className="font-jakarta font-medium text-[0.875rem]/[1.375rem] text-[#02141C]">{t("name")}</span>
                            <div className="w-full h-12 gap-2 border border-gray-300 py-[0.25rem] px-[0.75rem] rounded-xl text-left flex items-center">
                                {user?.userName?.split(" ")[0] || ""}
                            </div>
                        </div>

                        <div className="h-full w-[15.15625rem] gap-2 flex flex-col">
                            <div className="h-full w-[15.15625rem] gap-2 flex flex-col">
                                <span className="font-jakarta font-medium text-[0.875rem]/[1.375rem] text-[#02141C]">{t("surname")}</span>
                                    <div className="w-full h-12 gap-2 border border-gray-300 py-[0.25rem] px-[0.75rem] rounded-xl text-left flex items-center">
                                    {user?.userName?.split(" ").slice(1).join(" ") || ""}
                                    </div>
                            </div>
                        </div>

                    </div>

                    <div className="w-full gap-4 flex flex-col">
                        <span className="font-jakarta font-medium text-[0.875rem]/[1.375rem] text-[#02141C]">{t("dateOfBirth")}</span>
                        <div className="w-full h-12 gap-2 border border-gray-300 rounded-xl">

                        </div>
                    </div>

                    <div className="w-full h-10 flex flex-row justify-between">
                        <button className="flex items-center justify-center group relative">
                            <span className="font-jakarta font-semibold text-[0.875rem]/[1.375rem] text-[#167AFE]">
                                {t("cancel")}
                            </span>
                            <div className="absolute bottom-[0.0625rem] w-0 h-0.5 bg-[#167AFE] group-hover:w-full transition-all duration-300 origin-center"/>
                        </button>
                        <button className="w-[8.4375rem] h-10 rounded-full hover:scale-110 transition-all bg-blue-600 flex items-center justify-center">
                            <span className="font-jakarta font-semibold text-[0.875rem]/[1.375rem] text-white">
                                {t("update")}
                            </span>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    </div>
  );
}
