import { db as dbServer, schema as dbSchema } from "./db.server.js";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const saveDescription = async ({
  targetType,
  targetId,
  title,
  content,
}) => {
  try {
    const descriptionId = uuidv4();

    const newDescription = await dbServer
      .insert(dbSchema.descriptions)
      .values({
        id: descriptionId,
        targetType,
        targetId,
        title,
        content,
        isDeleted: 0,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return newDescription[0];
  } catch (error) {
    console.error("Error saving description to database:", error);
    throw error;
  }
};

export const getDescription = async ({ targetType, targetId }) => {
  try {
    const description = await dbServer
      .select()
      .from(dbSchema.descriptions)
      .where(
        and(
          eq(dbSchema.descriptions.targetType, targetType),
          eq(dbSchema.descriptions.targetId, targetId.toLowerCase().trim()),
          eq(dbSchema.descriptions.isDeleted, 0),
        ),
      )
      .limit(1);

    return description[0] || null;
  } catch (error) {
    console.error("Error retrieving description from database:", error);
    return null;
  }
};

export const descriptionExists = async ({ targetType, targetId }) => {
  const description = await getDescription({ targetType, targetId });
  return description !== null;
};
