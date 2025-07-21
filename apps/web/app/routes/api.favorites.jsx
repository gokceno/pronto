import { json } from "@remix-run/node";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { eq, and } from "drizzle-orm";
import { authenticator } from "@pronto/auth/auth.server.js";
import { v4 as uuidv4 } from "uuid";

// GET: Check if a target is favorited by the current user
export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request);

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
    const existingFavorite = await dbServer
      .select()
      .from(dbSchema.favorites)
      .where(
        and(
          eq(dbSchema.favorites.userId, user.id),
          eq(dbSchema.favorites.targetId, targetId),
          eq(dbSchema.favorites.targetType, targetType),
        ),
      )
      .limit(1);

    return json({
      isFavorited: existingFavorite.length > 0,
      authenticated: true,
      targetId,
      targetType,
    });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    console.error(
      "[API:favorites:loader] Error checking favorite status:",
      error,
    );
    return json(
      {
        error: "Failed to check favorite status",
        authenticated: !!user,
        errorMessage: error.message,
      },
      { status: 500 },
    );
  }
}

export async function action({ request }) {
  if (request.method === "POST") {
    const user = await authenticator.isAuthenticated(request);

    if (!user) {
      return json(
        {
          error: "Authentication required",
          authenticated: false,
          message: "You must be logged in to favorite items",
        },
        { status: 401 },
      );
    }

    const formData = await request.json();
    const { targetId, targetType } = formData;

    if (!targetId || !targetType) {
      return json({ error: "Missing targetId or targetType" }, { status: 400 });
    }

    try {
      // Check if the item is already favorited
      const existingFavorite = await dbServer
        .select()
        .from(dbSchema.favorites)
        .where(
          and(
            eq(dbSchema.favorites.userId, user.id),
            eq(dbSchema.favorites.targetId, targetId),
            eq(dbSchema.favorites.targetType, targetType),
          ),
        )
        .limit(1);

      if (existingFavorite.length > 0) {
        console.log("[API:favorites:add] Item already favorited", {
          userId: user.id,
          targetId,
          targetType,
        });
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

      console.log("[API:favorites:add] Successfully added to favorites", {
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
      console.error("[API:favorites:add] Error adding favorite:", error);
      return json(
        {
          error: "Failed to add favorite",
          authenticated: true,
          errorMessage: error.message,
        },
        { status: 500 },
      );
    }
  } else if (request.method === "DELETE") {
    const user = await authenticator.isAuthenticated(request);

    if (!user) {
      return json(
        {
          error: "Authentication required",
          authenticated: false,
          message: "You must be logged in to manage favorites",
        },
        { status: 401 },
      );
    }

    const formData = await request.json();
    const { targetId, targetType } = formData;

    if (!targetId || !targetType) {
      return json({ error: "Missing targetId or targetType" }, { status: 400 });
    }

    try {
      // Remove from favorites
      await dbServer
        .delete(dbSchema.favorites)
        .where(
          and(
            eq(dbSchema.favorites.userId, user.id),
            eq(dbSchema.favorites.targetId, targetId),
            eq(dbSchema.favorites.targetType, targetType),
          ),
        );

      return json({
        success: true,
        message: "Removed from favorites",
        authenticated: true,
        isFavorited: false,
        targetId,
        targetType,
      });
    } catch (error) {
      console.error("[API:favorites:delete] Error removing favorite:", error);
      return json(
        {
          error: "Failed to remove favorite",
          authenticated: true,
          errorMessage: error.message,
        },
        { status: 500 },
      );
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
