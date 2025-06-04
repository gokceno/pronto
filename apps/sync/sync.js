import { RadioBrowserApi } from 'radio-browser-api';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './db/schema.js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../web/.env') });
const dbName = process.env.DB_FILE_NAME;
console.log("process.env", process.env.DB_FILE_NAME);
const db = drizzle(new Database(dbName), { schema });
const api = new RadioBrowserApi('PRONTO_SYNC');

export async function sync(type = "all") {
  if (type === "countries" || type === "all") {
    console.log("-Starting countries sync-");
    // 1. Countries
    const countries = await api.getCountries();
    for (const country of countries) {
      await db.insert(schema.countries).values({
        id: uuidv4(),
        country_name: country.name,
        iso_3166_1: country.iso_3166_1,
      });
    }
    console.log("Countries sync completed!");
  }

  if (type === "stations" || type === "all") {
    console.log("-Starting stations sync-");
    // 2. Stations (Radios)
    const stations = await api.searchStations({ reverse: true });
    for (const station of stations) {
      // Find countryId
      const country = await db.query.countries.findFirst({
        where: (c, { eq }) => eq(c.iso_3166_1, station.countryCode)
      });
      if (!country) continue;

      await db.insert(schema.radios).values({
        id: String(station.id),
        radio_name: station.name,
        url: station.url,
        favicon: station.favicon,
        countryId: country.id,
        radio_tags: JSON.stringify(station.tags || []),
        radio_language: JSON.stringify(station.language || []),
      });
    }
    console.log("Stations sync completed!");
  }
}