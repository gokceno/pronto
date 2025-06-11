import { RadioBrowserApi } from 'radio-browser-api';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '@pronto/db/schema.js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../web/.env') });
const dbName = process.env.DB_FILE_NAME;
const db = drizzle(new Database(dbName), { schema });
const api = new RadioBrowserApi('PRONTO_SYNC');

function normalizeRadioName(name) {
  let normalized = name.normalize('NFKC');
  normalized = normalized.replace(
    /[\p{Emoji_Presentation}\p{Extended_Pictographic}\p{So}\p{Sk}\p{Sm}\p{Sc}]/gu,
    ''
  );
  return normalized;
}

export async function sync(type = "all") {
  
  const valid = ['all', 'countries', 'stations'];
  if (!valid.includes(type)) {
    throw new Error(`Unsupported sync type: ${type}.\nValid types are: ${valid.join(', ')}`);
  }

  // Simple loading animation for long fetches
  function startLoading(message = "Syncing...") {
    const frames = ['|', '/', '-', '\\'];
    let i = 0;
    process.stdout.write(message + " ");
    const interval = setInterval(() => {
      process.stdout.write('\b' + frames[i = ++i % frames.length]);
    }, 150);
    return () => {
      clearInterval(interval);
      process.stdout.write('\b');
      console.log("\nDone.");
    };
  }

  if (type === "countries" || type === "all") {
    console.log("\n-Starting countries sync-");

    console.log("Deleting existing data...");
    await db.delete(schema.favorites);
    await db.delete(schema.usersListsRadios);
    await db.delete(schema.radios);
    await db.delete(schema.countries);

    // 1. Countries
    const stopCountriesLoading = startLoading("Fetching countries from API");
    const countries = await api.getCountries();
    stopCountriesLoading();

    console.log("Inserting countries into database...");
    for (const country of countries) {
      await db.insert(schema.countries).values({
        id: uuidv4(),
        countryName: country.name,
        iso: country.iso_3166_1,
      });
    }
    console.log("COUNTRIES SYNC COMPLETED!");
  }

  if (type === "stations" || type === "all") {
    console.log("\n-Starting stations sync-");

    console.log("Deleting existing data...");
    await db.delete(schema.favorites);
    await db.delete(schema.usersListsRadios);
    await db.delete(schema.radios);

    // 2. Stations (Radios)
    const stopStationsLoading = startLoading("Fetching stations from API");
    const stations = await api.searchStations({ reverse: true });
    stopStationsLoading();

    console.log("Inserting stations into database...");
    for (const station of stations) {
      const country = await db.query.countries.findFirst({
        where: (c, { eq }) => eq(c.iso, station.countryCode)
      });
      if (!country) continue;

      const normalizedName = normalizeRadioName(station.name);
      if (!normalizedName.trim()) continue;

      await db.insert(schema.radios).values({
        id: station.id,
        radioName: normalizeRadioName(station.name),
        url: station.url,
        favicon: station.favicon,
        countryId: country.id,
        radioTags: JSON.stringify(station.tags || []),
        radioLanguage: JSON.stringify(station.language || []),
      });

    }
    console.log("STATIONS SYNC COMPLETED!");
  }
  console.log("\nSynchronization completed successfully!\n");
}