



export default function Footer() {
  return (
    <footer className="bg-[#0E1217] text-white py-3 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <img
            src="/assets/radio_pronto_icon.svg"
            alt="Radio Pronto"
            className="mr-2"
          />
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span>{t('rights')}</span>
            <span>{t('personalData')}</span>
            <span>{t('cookies')}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a href="https://apps.apple.com/download">
            <img
              src="/assets/apple_store_download.png"
              alt="Download on App Store"
              className="h-10"
            />
          </a>
          <a href="https://play.google.com/store/download">
            <img
              src="/assets/google_play_download.png"
              alt="Get it on Google Play"
              className="h-10"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

