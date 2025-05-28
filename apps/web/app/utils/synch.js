import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import fetch from 'node-fetch'; // If using Node 18+, you can remove this import
import {
  countries,
  genres,
  radios,
  radioGenres,
} from '../db/schema.js';

const db = drizzle(process.env.DB_FILE_NAME);

// Helper to upsert country
async function upsertCountry(apiCountry) {
  // Try to find by code
  const existing = await db.select().from(countries).where(eq(countries.code, apiCountry.iso_3166_1)).limit(1);
  if (existing.length === 0) {
    await db.insert(countries).values({
      name: apiCountry.name,
      code: apiCountry.iso_3166_1,
      // isDeleted, createdAt: defaults
    });
  }
}

// Helper to upsert genre
async function upsertGenre(apiGenre) {
  const existing = await db.select().from(genres).where(eq(genres.name, apiGenre.name)).limit(1);
  if (existing.length === 0) {
    await db.insert(genres).values({
      name: apiGenre.name,
      // isDeleted, createdAt: defaults
    });
  }
}

// Helper to upsert radio
async function upsertRadio(apiRadio, countryId) {
  const existing = await db.select().from(radios).where(eq(radios.id, apiRadio.stationuuid)).limit(1);
  if (existing.length === 0) {
    await db.insert(radios).values({
      id: apiRadio.stationuuid,
      name: apiRadio.name,
      url: apiRadio.url,
      favicon: apiRadio.favicon,
      countryId: countryId,
      // isDeleted, createdAt: defaults
    });
  }
}

// Helper to upsert radio-genre relation
async function upsertRadioGenre(radioId, genreId) {
  const existing = await db
    .select()
    .from(radioGenres)
    .where(eq(radioGenres.radioId, radioId))
    .where(eq(radioGenres.genreId, genreId))
    .limit(1);
  if (existing.length === 0) {
    await db.insert(radioGenres).values({
      radioId,
      genreId,
      // createdAt: default
    });
  }
}

export async function syncRadioBrowser() {
  // 1. Sync countries
  const countriesRes = await fetch('https://de1.api.radio-browser.info/json/countries');
  const apiCountries = await countriesRes.json();
  for (const c of apiCountries) {
    await upsertCountry(c);
  }
  console.log('Countries synced!');

  // 2. Sync genres (tags)
  const genresRes = await fetch('https://de1.api.radio-browser.info/json/tags');
  const apiGenres = await genresRes.json();
  for (const g of apiGenres) {
    await upsertGenre({ name: g.name });
  }
  console.log('Genres synced!');

  // 3. Sync radios (stations)
  // You may want to limit for testing, e.g. ?limit=100
  const radiosRes = await fetch('https://de1.api.radio-browser.info/json/stations?limit=100');
  const apiRadios = await radiosRes.json();

  // Preload all genres and countries for mapping
  const allGenres = await db.select().from(genres);
  const allCountries = await db.select().from(countries);

  for (const r of apiRadios) {
    // Find countryId
    const country = allCountries.find(c => c.code === r.countrycode);
    const countryId = country ? country.id : null;

    await upsertRadio(r, countryId);

    // Handle genres/tags for this radio
    if (r.tags) {
      const tagNames = r.tags.split(',').map(t => t.trim()).filter(Boolean);
      for (const tagName of tagNames) {
        // Find genreId
        let genre = allGenres.find(g => g.name.toLowerCase() === tagName.toLowerCase());
        if (!genre) {
          // Insert new genre if not found
          await upsertGenre({ name: tagName });
          // Re-fetch
          genre = (await db.select().from(genres).where(eq(genres.name, tagName)).limit(1))[0];
          allGenres.push(genre);
        }
        await upsertRadioGenre(r.stationuuid, genre.id);
      }
    }
  }
  console.log('Radios and radio-genres synced!');
}

// If you want to run directly:
if (process.argv[1] === new URL(import.meta.url).pathname) {
  syncRadioBrowser().then(() => {
    console.log('Sync complete!');
    process.exit(0);
  });
}