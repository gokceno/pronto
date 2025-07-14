import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { createCookieSessionStorage } from "@remix-run/node";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import {
  db as dbServer,
  schema as dbSchema,
} from "../../apps/web/app/utils/db.server.js";

// ENV VARS
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  SESSION_SECRET,
} = process.env;

// Session storage
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

// Authenticator instance
export const authenticator = new Authenticator(sessionStorage);

// Google OAuth strategy
const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
  },
  async ({ profile }) => {
    try {
      // Find user by email
      const email = profile.emails[0].value;
      let user = await dbServer
        .select()
        .from(dbSchema.users)
        .where(eq(dbSchema.users.email, email))
        .get();

      // If not found, create user
      if (!user) {
        const newUser = {
          id: uuidv4(),
          email,
          userName: profile.displayName,
          avatar: profile.photos?.[0]?.value || null,
          isDeleted: 0,
        };
        await dbServer.insert(dbSchema.users).values(newUser).run();
        user = newUser;
      }

      // Return user object for session
      return {
        id: user.id,
        email: user.email,
        userName: user.userName,
        avatar: user.avatar,
      };
    } catch (err) {
      console.error("Error in GoogleStrategy callback:", err);
      throw err;
    }
  },
);

authenticator.use(googleStrategy);

export default authenticator;
