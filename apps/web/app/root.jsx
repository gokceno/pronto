import { Links, Meta, Outlet, Scripts, LiveReload } from "@remix-run/react";
import stylesheet from "./tailwind.css?url";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Header from "./components/header.jsx";
import { useTranslation } from "react-i18next";
import Footer from "./components/footer.jsx";

export const meta = () => [{ title: "Radio Pronto!" }];
export const links = () => [{ rel: "stylesheet", href: stylesheet }];

export async function loader({ request }) {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  
  const supportedLocales = ["en", "tr"];
  const isValidLocale = supportedLocales.includes(firstSegment);
  const locale = isValidLocale ? firstSegment : "en";
  
  return json({ locale });
}

export function Layout({ children }) {
  const { locale } = useLoaderData();
  const { i18n } = useTranslation();

  if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }
 
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
      <body className="bg-gray-100 pt-16">
        <Header locale={locale} />
        {children}
        <Footer />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
      <Outlet />
  );
}
