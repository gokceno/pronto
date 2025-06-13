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
  // This page will not be shown because of redirects in the loader,
  // but in case it is, show a simple loading message.
  const navigate = useNavigate();

  useEffect(() => {
    // fallback: redirect to home after a short delay
    const timeout = setTimeout(() => {
      navigate("/", { replace: true });
    }, 2000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <span className="text-lg font-semibold">Signing you in with Google...</span>
    </div>
  );
}
