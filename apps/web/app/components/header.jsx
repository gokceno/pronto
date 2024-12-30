import { Link } from "@remix-run/react";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { HomeIcon, LightningBoltIcon, GlobeIcon, PersonIcon } from "@radix-ui/react-icons";

export default function Header() {
    const navigate = useNavigate();
    const { t } = useTranslation();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-800 text-white py-4 px-6 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <img src="/assets/radio_pronto_icon.svg" alt="Radio Pronto" className="mr-2" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-white hover:text-yellow-200">
              <Link to="/" className="flex items-center">
              <HomeIcon className="w-6 h-6 mr-1" />
              {t('homePage')}
            </Link></div>

            <Link to="/genres" className="flex items-center">
            <div className="flex items-center text-white hover:text-yellow-200">
              <LightningBoltIcon className="w-6 h-6 mr-1" />
              {t('genres')}
            </div>
            </Link>

            <div className="flex items-center text-white hover:text-yellow-200">
            <Link to="/countries" className="flex items-center">
              <GlobeIcon className="w-6 h-6 mr-1" />
              {t('countries')}
            </Link></div>
            
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/create-list" className="bg-yellow-300 text-black px-4 py-2 rounded-full flex items-center font-medium">
            <img src="/assets/music_list.svg" alt="music list" className="mr-2"/>
            {t('createRadioList')}
          </Link>
          <Link to="/profile" className="bg-blue-600/20 p-2 rounded-full">
            <PersonIcon className="w-6 h-6 text-white" />
          </Link>
          
        </div>
      </div>
    </div>
  );
}
