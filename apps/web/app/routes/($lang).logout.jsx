import { redirect } from "@remix-run/node";
import { sessionStorage } from "@pronto/auth/auth.server";
import authenticator from "@pronto/auth/auth.server";

export const loader = async ({ request, params }) => {
  const locale = params.lang || "en";
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect(`/${locale}/login`);
  }
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  return redirect(`/${locale}/login`, {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
};

export default function Logout() {
  return null;
}
