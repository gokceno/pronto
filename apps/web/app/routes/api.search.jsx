// pronto/apps/web/app/routes/api.search.jsx
import { json } from "@remix-run/node";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { eq, like, and, or } from "drizzle-orm";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() || "";

  if (!q) {
    return json({ radios: [], genres: [], countries: [] });
  }

  const radios = await dbServer
    .select({
      id: dbSchema.radios.id,
      name: dbSchema.radios.radioName,
      url: dbSchema.radios.url,
      country: dbSchema.radios.countryId,
      tags: dbSchema.radios.radioTags,
      language: dbSchema.radios.radioLanguage,
    })
    .from(dbSchema.radios)
    .where(
      and(
        eq(dbSchema.radios.isDeleted, 0),
        like(dbSchema.radios.radioName, `%${q}%`)
      )
    );


  const genres = await dbServer
    .select({
      tags: dbSchema.radios.radioTags,
      language: dbSchema.radios.radioLanguage,
    })
    .from(dbSchema.radios)
    .where(
      and(
        eq(dbSchema.radios.isDeleted, 0),
        or(
          like(dbSchema.radios.radioTags, `%${q}%`),
          like(dbSchema.radios.radioLanguage, `%${q}%`)
        )
      )
    );

  const genresSet = new Set();
  genres.forEach(({ tags, language }) => {
    try {
      JSON.parse(tags || "[]").forEach(tag => genresSet.add(tag));
    } catch (err) {
      console.warn('Failed to parse tags:', err);
    }
    try {
      JSON.parse(language || "[]").forEach(lang => genresSet.add(lang));
    } catch (err) {
      console.warn('Failed to parse language:', err);
    }
  });

  // Countries
  const countries = await dbServer
    .select({
      id: dbSchema.countries.id,
      name: dbSchema.countries.countryName,
      iso: dbSchema.countries.iso,
    })
    .from(dbSchema.countries)
    .where(
      and(
        eq(dbSchema.countries.isDeleted, 0),
        like(dbSchema.countries.countryName, `%${q}%`)
      )
    );

  return json({
    radios,
    genres: Array.from(genresSet),
    countries,
  });
};