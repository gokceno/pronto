import { Links, Meta, Outlet, Scripts } from "@remix-run/react";
import stylesheet from "./tailwind.css?url";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Header from "./components/header.jsx";
import { useTranslation } from "react-i18next";
import MiniAudioPlayer from "./components/mini-audio-player.jsx";
import Footer from "./components/footer.jsx";
import StickyAudioPlayer from "./components/sticky-audio-player.jsx";
import { useState, useEffect } from "react";

export const meta = () => [{ title: "Radio Pronto!" }];
export const links = () => [{ rel: "stylesheet", href: stylesheet }];

export let handle = {
  i18n: "translation",
};

export async function loader({ request }) {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];

  const supportedLocales = ["en", "tr"];
  const isValidLocale = supportedLocales.includes(firstSegment);
  const locale = isValidLocale ? firstSegment : "en";
  
  return {
    locale
  };
}

export function Layout({ children }) {
  const { i18n } = useTranslation();
  const { locale } = useLoaderData();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [i18n, locale]);

  const [isStickyAudioPlayerVisible, setIsStickyAudioPlayerVisible] = useState(true);  

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <Header locale={locale} className="flex-shrink-0" />
        <main className="flex-grow pt-16">
        {children}
        {isStickyAudioPlayerVisible && (
            <StickyAudioPlayer
              songName={"Eric Chen - Praise Of Love"}
              name={"Nhers Teleradyo Patro"}
              clickcount={224}
              votes={987}
            />
          )}
        </main>
        <Footer className="flex-shrink-0" />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
