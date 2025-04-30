import { useTranslation } from "react-i18next";

export default function Login() {
    const { t } = useTranslation();

  return (
    <div className="flex flex-row justify-between">

        <div className="flex my-auto items-center p-2 gap-2 h-full w-[55.4375rem]">
            <div className="flex flex-col mx-auto gap-8 w-[24.625rem] h-[29.9375rem] items-center">
                
                <span className="text-[#00192C] text-[2.25rem]/[3rem] font-jakarta font-extrabold">
                    {t("pronto")}
                </span>

                <div className="flex flex-col p-[2.8125rem] gap-[2.8125rem] rounded-[1.5rem] bg-white w-[24.625rem] h-[21.4375rem]">
                    
                    <div className="flex flex-col gap-8 w-[19rem] h-[9.5rem]">
                        <div className="flex flex-col gap-4 w-full h-[4.5rem]">
                            <span className="text-[#00192C] text-[1.5rem]/[2rem] font-jakarta font-semibold">
                                {t("login")}
                            </span>

                            <span className="text-[#4F5457] text-[1rem]/[1.5rem] font-jakarta font-normal">
                                {t("loginWithMail")}
                            </span>
                        </div>

                        <div className="w-full h-[3rem] gap-6 border border-gray-300 rounded-md flex items-center pl-2">
                            <span className="text-[#656B6F] text-[0.875rem]/[1.375rem] font-jakarta font-normal"> 
                                {t("yourMail")}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-center items-center w-[8.875rem] h-[3.5rem] bg-[#167AFE] rounded-[2rem]">
                        <span className="text-white text-[1rem]/[1.5rem] font-jakarta font-semibold">
                            {t("continue")}
                        </span>
                    </div>
                </div>

                <div className="text-center w-full h-[1.5rem] flex flex-row justify-center">
                    <span className="text-[#00192C] text-[1rem]/[1.5rem] font-jakarta font-normal">
                        {t("noAccount")}
                    </span>
                    <span className="text-[#167AFE] text-[1rem]/[1.5rem] font-jakarta font-normal ml-1">
                        {t("signUpNoAccount")}
                    </span>
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
  );
}