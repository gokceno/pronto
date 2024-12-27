import { Links, Meta, Outlet, Scripts } from "@remix-run/react";
import { useChangeLanguage } from "remix-i18next/react";
import i18next from "./i18next.server";
import stylesheet from "./tailwind.css?url";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Header from "./components/header.jsx";

export const meta = () => [{ title: "Radio Pronto!" }];
export const links = () => [{ rel: "stylesheet", href: stylesheet }];

export async function loader({ request }) {
  let locale = await i18next.getLocale(request);
  return json({ locale });
}

export function Layout({ children }) {
  const { locale } = useLoaderData();
  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100 pt-16">
        <Scripts />
        <script
          defer
          data-domain="radiopronto.net"
          src="https://plausible.io/js/script.js"
        ></script>
            <Header />
            {children}
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
