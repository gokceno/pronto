import { authenticator } from "@pronto/auth/auth.server";

export const loader = async ({ request, params }) => {
  const { lang } = params;
  return authenticator.authenticate("google", request, {
    successRedirect: `/${lang}/_index`,
    failureRedirect: `/${lang}/login`,
  });
};

export default function AuthGoogle() {
  return null;
}