import { Outlet, Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="container flex">
      <div className="w-[20%] ml-4">
        <ul className="space-y-0.5">
          {[
            "United States",
            "China",
            "Japan",
            "Germany",
            "United Kingdom",
            "India",
            "France",
            "Italy",
            "Canada",
            "South Korea",
            "Russia",
            "Brazil",
            "Australia",
            "Spain",
            "Mexico",
            "Indonesia",
            "Netherlands",
            "Saudi Arabia",
            "Turkey",
            "Switzerland",
          ].map((country) => (
            <li key={country}>
              <Link
                to="us"
                className="text-blue-600 font-mono text-sm hover:bg-green-400 px-2 py-0.5 rounded"
              >
                {country}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Outlet />
    </div>
  );
}
