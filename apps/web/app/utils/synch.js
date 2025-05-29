import { RadioBrowserApi } from 'radio-browser-api';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../db/schema.js';
import { v4 as uuidv4 } from 'uuid';

const db = drizzle(new Database('./local.db'), { schema });
const api = new RadioBrowserApi('PRONTO_SYNC');

async function sync() {
  // 1. Genres
  const genres = await api.getTags();
  for (const genre of genres) {
    await db.insert(schema.genres).values({
      id: uuidv4(),
      name: genre.name,
      stationcount: genre.stationcount,
    });
  }

  // 2. Countries
  const countries = await api.getCountries();
  for (const country of countries) {
    await db.insert(schema.countries).values({
      id: uuidv4(),
      name: country.name,
      code: country.iso_3166_1,
      stationcount: country.stationcount, 
    });
  }

  // 3. Stations (Radios)
  const stations = await api.searchStations({ reverse: true, limit: 1000 });
  for (const station of stations) {
    // Find countryId
    const country = await db.query.countries.findFirst({ where: (c, { eq }) => eq(c.code, station.countrycode) });
    const radioId = String(station.id);
    await db.insert(schema.radios).values({
      id: radioId,
      name: station.name,
      url: station.url,
      favicon: station.favicon,
      countryId: country?.id,
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
}

sync().then(() => {
  console.log('Sync complete!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});