import { authenticator } from "@pronto/auth/auth.server";
import { generateLocalizedRoute } from "../utils/generate-route";

export const loader = async ({ request, params }) => {
  const locale = params.lang;
  return authenticator.authenticate("google", request, {
    successRedirect: generateLocalizedRoute(locale, "/"),
    failureRedirect: generateLocalizedRoute(locale, "/login"),
  });
};

export default function AuthGoogle() {
  return null;
}