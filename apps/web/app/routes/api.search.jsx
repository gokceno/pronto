// pronto/apps/web/app/routes/api.search.jsx
import { json } from "@remix-run/node";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { eq, like, and } from "drizzle-orm";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() || "";

  if (!q) {
    return json({ radios: [], genres: [], countries: [] });
  }

  // Radios by name
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
    )
    .limit(5);

  const genresSet = new Set();
  const radiosForGenres = await dbServer
    .select({
      tags: dbSchema.radios.radioTags,
      language: dbSchema.radios.radioLanguage,
    })
    .from(dbSchema.radios)
    .where(eq(dbSchema.radios.isDeleted, 0))
    .limit(5);

  radiosForGenres.forEach(({ tags, language }) => {
    try {
      JSON.parse(tags || "[]").forEach(tag => {
        if (tag.toLowerCase().includes(q.toLowerCase())) genresSet.add(tag);
      });
      JSON.parse(language || "[]").forEach(lang => {
        if (lang.toLowerCase().includes(q.toLowerCase())) genresSet.add(lang);
      });
    } catch {}
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
    )
    .limit(5);

  return json({
    radios,
    genres: Array.from(genresSet),
    countries,
  });
};