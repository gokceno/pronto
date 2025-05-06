import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { Link } from "@remix-run/react";
import { generateLocalizedRoute } from "../utils/generate-route";


export default function Footer({locale}) {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0E1217] text-white py-6 px-6">
      <div className="flex justify-between items-center">
        <Link to={generateLocalizedRoute(locale, "/")} className="flex items-center space-x-6 hover:scale-105 transition-all">
          <img
            src="/assets/radio_pronto_icon.svg"
            alt="Radio Pronto"
            className="mr-2"
          />
        </Link>
        <div className="flex items-center gap-2">
          <a href="https://github.com/gokceno/pronto" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-gray-300">
            <span className="text-sm">{t("github")}</span>
            <GitHubLogoIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

