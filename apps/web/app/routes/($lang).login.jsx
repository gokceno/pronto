import { useTranslation } from "react-i18next";
import { generateLocalizedRoute } from "../utils/generate-route";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params }) => {
  const locale = params.lang;
  return { locale };
};

export default function Login() {
  const { t } = useTranslation();
  const { locale } = useLoaderData();

  return (
    <div className="flex flex-row justify-between">
      <div className="flex my-auto items-center p-2 gap-2 h-full w-[55.4375rem]">
        <div className="flex flex-col mx-auto gap-8 w-[24.625rem] h-[29.9375rem] items-center">
          <span className="text-[#00192C] text-[2.25rem]/[3rem] font-jakarta font-extrabold">
            {t("pronto")}
          </span>

          <div className="flex flex-col p-[2.8125rem] gap-[2.8125rem] rounded-[1.5rem] bg-white w-[31.5625rem] h-[16.4375rem]">
            (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-800 text-sm font-medium">
                {t(
                  "sessionExpired",
                  "Your session has expired after 2 days. Please sign in again.",
                )}
              </p>
            </div>
            )
            <div className="flex flex-col gap-8 w-[19rem] h-[9.5rem]">
              <div className="flex flex-col gap-4 w-full h-[4.5rem]">
                <span className="text-[#00192C] text-[1.5rem]/[2rem] font-jakarta font-semibold">
                  {t("signIn")}
                </span>

                <div className="flex flex-col p-[2.8125rem] gap-[2.8125rem] rounded-[1.5rem] bg-white w-[31.5625rem] h-[16.4375rem]">
                  <div className="flex flex-col gap-8 w-[19rem] h-[9.5rem]">
                    <div className="flex flex-col gap-4 w-full h-[4.5rem]">
                      <span className="text-[#00192C] text-[1.5rem]/[2rem] font-jakarta font-semibold">
                        {t("signIn")}
                      </span>

                      <span className="text-[#4F5457] text-[1rem]/[1.5rem] font-jakarta font-normal">
                        {t("googleSignIn")}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={generateLocalizedRoute(locale, "/auth/google")}
                    className="flex justify-center items-center w-[25.9375rem] h-[3.5rem] bg-white p-4 border-gray-300 border rounded-[2rem] hover:scale-105 transition-all"
                  >
                    <img
                      src="/assets/google-icon.svg"
                      alt="Google"
                      className="mr-2"
                    />
                    <span className="text-[#00192C] text-[1rem]/[1.5rem] font-jakarta font-semibold">
                      {t("googleButton")}
                    </span>
                  </Link>
                </div>
              </div>

              <Link
                to={generateLocalizedRoute(locale, "/auth/google")}
                className="flex justify-center items-center w-[25.9375rem] h-[3.5rem] bg-white p-4 border-gray-300 border rounded-[2rem] hover:scale-105 transition-all"
              >
                <img
                  src="/assets/google-icon.svg"
                  alt="Google"
                  className="mr-2"
                />
                <span className="text-[#00192C] text-[1rem]/[1.5rem] font-jakarta font-semibold">
                  {t("googleButton")}
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="w-[34.5625rem] h-screen bg-[url('/assets/login-banner.png')] bg-cover bg-no-repeat flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-b via-transparent from-[#167AFE] to-[#00192C] opacity-70"></div>
          <span className="text-white text-[2.5rem]/[3.25rem] font-jakarta font-bold whitespace-pre-line p-[3.75rem] block relative z-10">
            {t("loginBanner")}
          </span>
        </div>
      </div>
    </div>
  );
}
