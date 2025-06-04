import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: process.env.SCHEMA_PATH,
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DB_FILE_NAME,
  },
});
