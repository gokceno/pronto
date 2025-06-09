import setup from "@pronto/db";

const { db, schema } = setup({
  filePath: process.env.DB_FILE_NAME,
});
export { db, schema };