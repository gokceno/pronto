import { json } from "@remix-run/node";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { eq, and } from "drizzle-orm";
import { authenticator } from "@pronto/auth/auth.server.js";
import { v4 as uuidv4 } from "uuid";

// Helper function to check authentication
const checkAuthentication = async (request) => {
  const user = await authenticator.isAuthenticated(request);
  return { user };
};

// Handle unauthorized responses
const handleUnauthorized = (action) => {
  return json(
    {
      error: "Authentication required",
      authenticated: false,
      message: `You must be logged in to ${action} radio lists`,
    },
    { status: 401 },
  );
};

// Handle error responses
const handleError = (error, action) => {
  console.error(`[API:radio-lists:${action}] Error:`, error);
  return json(
    {
      error: `Failed to ${action} radio list`,
      authenticated: true,
      errorMessage: error.message,
    },
    { status: 500 },
  );
};

// GET: Fetch radio lists for the current user
export async function loader({ request }) {
  const { user } = await checkAuthentication(request);

  if (!user) {
    return handleUnauthorized("view");
  }

  try {
    // Fetch all radio lists for the user that aren't deleted
    const userLists = await dbServer
      .select()
      .from(dbSchema.usersLists)
      .where(
        and(
          eq(dbSchema.usersLists.userId, user.id),
          eq(dbSchema.usersLists.isDeleted, 0),
        ),
      );

    // For each list, fetch the associated radios
    const listsWithRadios = await Promise.all(
      userLists.map(async (list) => {
        const listRadios = await dbServer
          .select({
            radio: dbSchema.radios,
          })
          .from(dbSchema.usersListsRadios)
          .leftJoin(
            dbSchema.radios,
            eq(dbSchema.usersListsRadios.radioId, dbSchema.radios.id),
          )
          .where(
            and(
              eq(dbSchema.usersListsRadios.usersListId, list.id),
              eq(dbSchema.radios.isDeleted, 0),
            ),
          );

        return {
          ...list,
          radios: listRadios.map((item) => item.radio).filter(Boolean),
        };
      }),
    );

    return json({
      lists: listsWithRadios,
      authenticated: true,
    });
  } catch (error) {
    return handleError(error, "fetch");
  }
}

// Helper function to validate and extract request body data for creating/updating lists
const getCreateListParams = async (request) => {
  const formData = await request.json();
  const { userListName } = formData;

  const isValid = userListName && userListName.trim() !== "";
  return { userListName, isValid };
};

// Helper function to validate and extract request body data for adding/removing radios from lists
const getRadioListParams = async (request) => {
  const formData = await request.json();
  const { userListId, radioId } = formData;

  const isValid = userListId && radioId;
  return { userListId, radioId, isValid };
};

export async function action({ request }) {
  const { user } = await checkAuthentication(request);

  if (!user) {
    return handleUnauthorized("manage");
  }

  // Handle different operations based on request method and URL
  const url = new URL(request.url);
  const operation = url.searchParams.get("operation");

  // CREATE a new radio list
  if (request.method === "POST" && operation === "create-list") {
    const { userListName, isValid } = await getCreateListParams(request);

    if (!isValid) {
      return json({ error: "List name is required" }, { status: 400 });
    }

    try {
      const newListId = uuidv4();

      // Create the new list
      await dbServer.insert(dbSchema.usersLists).values({
        id: newListId,
        userId: user.id,
        userListName: userListName.trim(),
      });

      // Fetch the newly created list
      const newList = await dbServer
        .select()
        .from(dbSchema.usersLists)
        .where(eq(dbSchema.usersLists.id, newListId))
        .limit(1);

      return json({
        success: true,
        message: "Radio list created successfully",
        list: newList[0],
        authenticated: true,
      });
    } catch (error) {
      return handleError(error, "create");
    }
  }

  // ADD a radio to a list
  if (request.method === "POST" && operation === "add-radio") {
    const { userListId, radioId, isValid } = await getRadioListParams(request);

    if (!isValid) {
      return json(
        { error: "List ID and Radio ID are required" },
        { status: 400 },
      );
    }

    try {
      // Check if the list belongs to the user
      const userList = await dbServer
        .select()
        .from(dbSchema.usersLists)
        .where(
          and(
            eq(dbSchema.usersLists.id, userListId),
            eq(dbSchema.usersLists.userId, user.id),
          ),
        )
        .limit(1);

      if (userList.length === 0) {
        return json(
          { error: "List not found or unauthorized" },
          { status: 404 },
        );
      }

      // Check if the radio is already in the list
      const existingEntry = await dbServer
        .select()
        .from(dbSchema.usersListsRadios)
        .where(
          and(
            eq(dbSchema.usersListsRadios.usersListId, userListId),
            eq(dbSchema.usersListsRadios.radioId, radioId),
          ),
        )
        .limit(1);

      if (existingEntry.length > 0) {
        return json({
          message: "Radio already in list",
          success: true,
          authenticated: true,
        });
      }

      // Add the radio to the list
      await dbServer.insert(dbSchema.usersListsRadios).values({
        id: uuidv4(),
        usersListId: userListId,
        radioId,
      });

      return json({
        success: true,
        message: "Radio added to list",
        authenticated: true,
      });
    } catch (error) {
      return handleError(error, "add radio");
    }
  }

  // REMOVE a radio from a list
  if (request.method === "DELETE" && operation === "remove-radio") {
    const { userListId, radioId, isValid } = await getRadioListParams(request);

    if (!isValid) {
      return json(
        { error: "List ID and Radio ID are required" },
        { status: 400 },
      );
    }

    try {
      // Check if the list belongs to the user
      const userList = await dbServer
        .select()
        .from(dbSchema.usersLists)
        .where(
          and(
            eq(dbSchema.usersLists.id, userListId),
            eq(dbSchema.usersLists.userId, user.id),
          ),
        )
        .limit(1);

      if (userList.length === 0) {
        return json(
          { error: "List not found or unauthorized" },
          { status: 404 },
        );
      }

      // Remove the radio from the list
      await dbServer
        .delete(dbSchema.usersListsRadios)
        .where(
          and(
            eq(dbSchema.usersListsRadios.usersListId, userListId),
            eq(dbSchema.usersListsRadios.radioId, radioId),
          ),
        );

      return json({
        success: true,
        message: "Radio removed from list",
        authenticated: true,
      });
    } catch (error) {
      return handleError(error, "remove radio");
    }
  }

  // DELETE a list
  if (request.method === "DELETE" && operation === "delete-list") {
    const formData = await request.json();
    const { userListId } = formData;

    if (!userListId) {
      return json({ error: "List ID is required" }, { status: 400 });
    }

    try {
      // Check if the list belongs to the user
      const userList = await dbServer
        .select()
        .from(dbSchema.usersLists)
        .where(
          and(
            eq(dbSchema.usersLists.id, userListId),
            eq(dbSchema.usersLists.userId, user.id),
          ),
        )
        .limit(1);

      if (userList.length === 0) {
        return json(
          { error: "List not found or unauthorized" },
          { status: 404 },
        );
      }

      // Soft delete the list by setting isDeleted to 1
      await dbServer
        .update(dbSchema.usersLists)
        .set({ isDeleted: 1 })
        .where(eq(dbSchema.usersLists.id, userListId));

      return json({
        success: true,
        message: "Radio list deleted",
        authenticated: true,
      });
    } catch (error) {
      return handleError(error, "delete");
    }
  }

  // UPDATE a list
  if (request.method === "PATCH") {
    const formData = await request.json();
    const { userListId, userListName } = formData;

    if (!userListId || !userListName) {
      return json({ error: "List ID and name are required" }, { status: 400 });
    }

    try {
      // Check if the list belongs to the user
      const userList = await dbServer
        .select()
        .from(dbSchema.usersLists)
        .where(
          and(
            eq(dbSchema.usersLists.id, userListId),
            eq(dbSchema.usersLists.userId, user.id),
          ),
        )
        .limit(1);

      if (userList.length === 0) {
        return json(
          { error: "List not found or unauthorized" },
          { status: 404 },
        );
      }

      // Update the list
      await dbServer
        .update(dbSchema.usersLists)
        .set({
          userListName: userListName.trim(),
        })
        .where(eq(dbSchema.usersLists.id, userListId));

      return json({
        success: true,
        message: "Radio list updated",
        authenticated: true,
      });
    } catch (error) {
      return handleError(error, "update");
    }
  }

  return json(
    {
      error: "Method or operation not supported",
      method: request.method,
      operation,
    },
    { status: 405 },
  );
}
