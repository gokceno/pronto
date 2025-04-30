import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import stylesheet from "./tailwind.css?url";
import { useLoaderData } from "@remix-run/react";
import Header from "./components/header.jsx";
import { useTranslation } from "react-i18next";
import Footer from "./components/footer.jsx";
import StickyAudioPlayer from "./components/sticky-audio-player.jsx";
import { useState, useEffect } from "react";
import { usePlayer } from "./contexts/player.jsx";
import { PlayerProvider } from "./contexts/player.jsx";

export const meta = () => [{ title: "Radio Pronto!" }];
export const links = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },

];

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

function AppLayout() {
  const { i18n } = useTranslation();
  const { locale } = useLoaderData();
  const [isHydrated, setIsHydrated] = useState(false);
  const { player } = usePlayer();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [i18n, locale]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <Header locale={locale} className="flex-shrink-0" />
        <main className="flex-grow pt-16">
          <Outlet />
          <StickyAudioPlayer />
        </main>
        <Footer className="flex-shrink-0" />
        <Scripts />
        <ScrollRestoration />
      </body>
    </html>
  );
}

export function Layout({ children }) {
  return (
    <PlayerProvider>
      {children}
    </PlayerProvider>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <AppLayout />
    </PlayerProvider>
  );
}