import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema.js";

export default function setup({ filePath }) {
  const client = createClient({
    url: `file:${filePath}`,
  });
  const db = drizzle(client, { schema });
  return { db, schema };
}
