import { useTranslation } from 'react-i18next';
export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#0E1217] text-white py-3 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <img
            src="/assets/radio_pronto_icon.svg"
            alt="Radio Pronto"
            className="mr-2"
          />
        </div>
      </div>
    </footer>
  );
}

