import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { authenticator } from "@pronto/auth/auth.server";
import { generateLocalizedRoute } from "../utils/generate-route";

export const loader = async ({ request, params }) => {
  const locale = params.lang;
  return authenticator.authenticate("google", request, {
    successRedirect: generateLocalizedRoute(locale, "/"),
    failureRedirect: generateLocalizedRoute(locale, "/login"),
  });
};

export default function GoogleCallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
