import { GitHubLogoIcon } from "@radix-ui/react-icons";

import { useTranslation } from 'react-i18next';
export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#0E1217] text-white py-6 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <img
            src="/assets/radio_pronto_icon.svg"
            alt="Radio Pronto"
            className="mr-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <a href="https://github.com/gokceno/pronto" className="flex items-center gap-2 text-white hover:text-gray-300">
            <span className="text-sm">Fork us on Github</span>
            <GitHubLogoIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

