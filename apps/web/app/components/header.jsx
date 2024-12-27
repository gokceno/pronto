import { Link } from "@remix-run/react";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { HomeIcon, LightningBoltIcon, GlobeIcon } from "@radix-ui/react-icons";

export default function Header() {
    const navigate = useNavigate();
    const { t } = useTranslation();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-800 text-white py-4 px-6 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <img src="/assets/pronto_radio_icon.png" alt="Pronto Radio" className="mr-2" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-white hover:text-yellow-200">
              <Link to="/" className="flex items-center">
              <HomeIcon className="w-6 h-6 mr-1" />
              {t('homePage')}
            </Link></div>

            <Link to="/turler" className="flex items-center">
            <div className="flex items-center text-white hover:text-yellow-200">
              <LightningBoltIcon className="w-6 h-6 mr-1" />
              {t('genres')}
            </div>
            </Link>

            <div className="flex items-center text-white hover:text-yellow-200">
            <Link to="/dunyadan" className="flex items-center">
              <GlobeIcon className="w-6 h-6 mr-1" />
              {t('countries')}
            </Link></div>
            
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-yellow-300 text-black px-4 py-2 rounded-full flex items-center font-medium">
          <img src="/assets/radio_list.png" alt="Radio List" className="mr-2"/>
            {t('createRadioList')}
          </button>
          <button className="bg-blue-600/20 p-2 rounded-full">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </button>
          
        </div>
      </div>
    </div>
  );
}
