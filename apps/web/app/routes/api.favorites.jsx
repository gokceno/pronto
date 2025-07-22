import { json } from "@remix-run/node";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { eq, and } from "drizzle-orm";
import { authenticator } from "@pronto/auth/auth.server.js";
import { v4 as uuidv4 } from "uuid";

// Helper function to check authentication
const checkAuthentication = async (request) => {
  const user = await authenticator.isAuthenticated(request);
  return { user, isAuthenticated: !!user };
};

// Helper function to get favorite where clause
const getFavoriteWhereClause = (userId, targetId, targetType) => {
  return and(
    eq(dbSchema.favorites.userId, userId),
    eq(dbSchema.favorites.targetId, targetId),
    eq(dbSchema.favorites.targetType, targetType),
  );
};

// Helper function to check if a favorite exists
const checkFavoriteExists = async (userId, targetId, targetType) => {
  const existingFavorite = await dbServer
    .select()
    .from(dbSchema.favorites)
    .where(getFavoriteWhereClause(userId, targetId, targetType))
    .limit(1);

  return existingFavorite.length > 0;
};

// GET: Check if a target is favorited by the current user
export async function loader({ request }) {
  const { user, isAuthenticated } = await checkAuthentication(request);

  if (!user) {
    return json({ isFavorited: false, authenticated: false });
  }

  const url = new URL(request.url);
  const targetId = url.searchParams.get("targetId");
  const targetType = url.searchParams.get("targetType");

  if (!targetId || !targetType) {
    return json({ error: "Missing targetId or targetType" }, { status: 400 });
  }

  try {
    const isFavorited = await checkFavoriteExists(
      user.id,
      targetId,
      targetType,
    );

    return json({
      isFavorited,
      authenticated: true,
      targetId,
      targetType,
    });
  } catch (error) {
    console.error(
      "[API:favorites:loader] Error checking favorite status:",
      error,
    );
    return json(
      {
        error: "Failed to check favorite status",
        authenticated: true,
        errorMessage: error.message,
      },
      { status: 500 },
    );
  }
}

// Helper function to validate and extract request body data
const getRequestParams = async (request) => {
  const formData = await request.json();
  const { targetId, targetType } = formData;

  const isValid = targetId && targetType;
  return { targetId, targetType, isValid };
};

// Handle unauthorized responses
const handleUnauthorized = (action) => {
  return json(
    {
      error: "Authentication required",
      authenticated: false,
      message: `You must be logged in to ${action} favorites`,
    },
    { status: 401 },
  );
};

// Handle error responses
const handleError = (error, action) => {
  console.error(`[API:favorites:${action}] Error:`, error);
  return json(
    {
      error: `Failed to ${action} favorite`,
      authenticated: true,
      errorMessage: error.message,
    },
    { status: 500 },
  );
};

export async function action({ request }) {
  const { user, isAuthenticated } = await checkAuthentication(request);

  if (!user) {
    return handleUnauthorized("manage");
  }

  const { targetId, targetType, isValid } = await getRequestParams(request);

  if (!isValid) {
    return json({ error: "Missing targetId or targetType" }, { status: 400 });
  }

  if (request.method === "POST") {
    try {
      // Check if the item is already favorited
      const isFavorited = await checkFavoriteExists(
        user.id,
        targetId,
        targetType,
      );

      if (isFavorited) {
        return json({
          message: "Already favorited",
          authenticated: true,
          isFavorited: true,
          targetId,
          targetType,
        });
      }

      // Add to favorites
      await dbServer.insert(dbSchema.favorites).values({
        id: uuidv4(),
        userId: user.id,
        targetId,
        targetType,
      });

      return json({
        success: true,
        message: "Added to favorites",
        authenticated: true,
        isFavorited: true,
        targetId,
        targetType,
      });
    } catch (error) {
      return handleError(error, "add");
    }
  } else if (request.method === "DELETE") {
    try {
      // Remove from favorites
      await dbServer
        .delete(dbSchema.favorites)
        .where(getFavoriteWhereClause(user.id, targetId, targetType));

      return json({
        success: true,
        message: "Removed from favorites",
        authenticated: true,
        isFavorited: false,
        targetId,
        targetType,
      });
    } catch (error) {
      return handleError(error, "remove");
    }
  }

  return json(
    {
      error: "Method not supported",
      method: request.method,
    },
    { status: 405 },
  );
}
