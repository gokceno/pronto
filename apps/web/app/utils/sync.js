import { RadioBrowserApi } from 'radio-browser-api';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../db/schema.js';
import { v4 as uuidv4 } from 'uuid';

const dbName = process.env.DB_NAME || 'local.db';
const db = drizzle(new Database(dbName), { schema });
const api = new RadioBrowserApi('PRONTO_SYNC');

export async function sync(type = "all") {
  if (type === "genres" || type === "all") {
    console.log("-Starting genres sync-");
    // 1. Genres
    const genres = await api.getTags();
    for (const genre of genres) {
      await db.insert(schema.genres).values({
        id: uuidv4(),
        name: genre.name,
        stationcount: genre.stationcount,
      });
    }
    console.log("Genres sycn completed!");
  }

  if (type === "countries" || type === "all") {
    console.log("-Starting countries sync-");
    // 2. Countries
    const countries = await api.getCountries();
    for (const country of countries) {
      await db.insert(schema.countries).values({
        id: uuidv4(),
        name: country.name,
        iso_3166_1: country.iso_3166_1,
        stationcount: country.stationcount, 
      });
    }
    console.log("Countries sycn completed!");
  }

  if (type === "stations" || type === "all") {
    console.log("-Starting stations sync-");
    // 3. Stations (Radios)
    const stations = await api.searchStations({ reverse: true });
    for (const station of stations) {
      // Find countryId
      const country = await db.query.countries.findFirst({
        where: (c, { eq }) => eq(c.iso_3166_1, station.countryCode)
      });      
      const radioId = String(station.id);
      await db.insert(schema.radios).values({
        id: radioId,
        name: station.name,
        url: station.url,
        favicon: station.favicon,
        countryCode: country?.iso_3166_1,
        tags: JSON.stringify(station.tags || []),         
        language: JSON.stringify(station.language || []), 
      });

      // Genres (tags)
      for (const tag of (station.tags || [])) {
        // Find genreId
        const genre = await db.query.genres.findFirst({ where: (g, { eq }) => eq(g.name, tag) });
        if (genre) {
          await db.insert(schema.radioGenres).values({
            id: uuidv4(),
            radioId,
            genreId: genre.id,
          });
        }
      }
    }
    console.log("Stations sycn completed!");

  }
}