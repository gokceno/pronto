import {
  Links,
  Meta,
  Outlet,
  Scripts,
  Link,
  useMatches,
} from "@remix-run/react";

import stylesheet from "./tailwind.css?url";

export const meta = () => [{ title: "Radio Pronto!" }];
export const links = () => [{ rel: "stylesheet", href: stylesheet }];

export function Layout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta charSet="utf-8" />  
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100">
        {children}
        <Scripts />
        <script defer data-domain="radiopronto.net" src="https://plausible.io/js/script.js"></script>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
