import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "./tailwind.css?url";
import { useLoaderData, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import Footer from "./components/footer.jsx";
import StickyAudioPlayer from "./components/sticky-audio-player.jsx";
import { useEffect } from "react";
import { usePlayer } from "./contexts/player.jsx";
import { authenticator } from "@pronto/auth/auth.server";
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
    href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap",
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
  const user = await authenticator.isAuthenticated(request);

  return {
    locale,
    user,
  };
}

function AppLayout() {
  const { i18n } = useTranslation();
  const { locale, user } = useLoaderData();

  const { player, setPlayer } = usePlayer();
  const location = useLocation();
  const isAuthRoute =
    location.pathname.includes("/auth/") ||
    location.pathname.includes("/login") ||
    location.pathname.includes("/logout");

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [i18n, locale]);

  // Stop audio player when navigating to auth/login pages
  useEffect(() => {
    if (isAuthRoute && player.isPlaying) {
      setPlayer((prevPlayer) => ({ ...prevPlayer, isPlaying: false }));
    }
  }, [isAuthRoute, player.isPlaying, setPlayer]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <main className={`flex-grow ${!isAuthRoute ? "" : ""}`}>
          <Outlet />
          {!isAuthRoute && <StickyAudioPlayer user={user} />}
        </main>
        {!isAuthRoute && <Footer locale={locale} className="flex-shrink-0" />}
        <Scripts />
        <ScrollRestoration />
      </body>
    </html>
  );
}

export function Layout({ children }) {
  return <PlayerProvider>{children}</PlayerProvider>;
}

export default function App() {
  return (
    <PlayerProvider>
      <AppLayout />
    </PlayerProvider>
  );
}
