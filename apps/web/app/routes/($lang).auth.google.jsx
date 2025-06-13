import { authenticator } from "@pronto/auth/auth.server";

export const loader = async ({ request, params }) => {
  const  locale = params.lang;
  return authenticator.authenticate("google", request, {
    successRedirect: `/${locale}`,
    failureRedirect: `/${locale}/login`,
  });
};

export default function AuthGoogle() {
  return null;
}