import { RadioBrowserApi } from "radio-browser-api";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "@pronto/db/schema.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../web/.env") });
const dbName = process.env.DB_FILE_NAME;
const db = drizzle(new Database(dbName), { schema });
const api = new RadioBrowserApi("PRONTO_SYNC");

const BATCH_SIZE = 1000;

function normalizeRadioName(name) {
  let normalized = name.normalize("NFKC");
  normalized = normalized.replace(
    /[\p{Emoji_Presentation}\p{Extended_Pictographic}\p{So}\p{Sk}\p{Sm}\p{Sc}]/gu,
    "",
  );
  return normalized;
}

export async function sync(type = "all") {
  const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    darkGreen: "\x1b[2;32m",
    orange: "\x1b[38;5;208m",
  };

  const valid = ["all", "countries", "stations"];
  if (!valid.includes(type)) {
    throw new Error(
      `${colors.red}Unsupported sync type: ${type}.\nValid types are: ${valid.join(", ")}${colors.reset}`,
    );
  }

  // Simple loading animation for long fetches
  function startLoading(message = `${colors.blue}Syncing...${colors.reset}`) {
    const frames = ["|", "/", "-", "\\"];
    let i = 0;
    process.stdout.write(message + " ");
    const interval = setInterval(() => {
      process.stdout.write("\b" + frames[(i = ++i % frames.length)]);
    }, 150);
    return () => {
      clearInterval(interval);
      process.stdout.write("\b");
      console.log(`${colors.green}\nDone.${colors.reset}`);
    };
  }

  if (type === "countries" || type === "all") {
    console.log(`${colors.cyan}\n-Starting countries sync-`);

    console.log(`${colors.blue}Deleting existing data...${colors.reset}`);
    await db.delete(schema.favorites);
    await db.delete(schema.usersListsRadios);
    await db.delete(schema.radios);
    await db.delete(schema.countries);

    // 1. Countries
    const stopCountriesLoading = startLoading(
      `${colors.blue}Fetching countries from API${colors.reset}`,
    );
    const countries = await api.getCountries();
    stopCountriesLoading();

    console.log(
      `${colors.yellow}Inserting countries into database...${colors.reset}`,
    );
    for (const country of countries) {
      await db.insert(schema.countries).values({
        id: uuidv4(),
        countryName: country.name,
        iso: country.iso_3166_1,
      });
    }
    console.log(`${colors.darkGreen}Countries sync completed!${colors.reset}`);
  }

  if (type === "stations" || type === "all") {
    console.log(`${colors.cyan}\n-Starting stations sync-`);

    console.log(`${colors.blue}Deleting existing data...${colors.reset}`);
    await db.delete(schema.favorites);
    await db.delete(schema.usersListsRadios);
    await db.delete(schema.radios);

    // 2. Stations (Radios)
    const stopStationsLoading = startLoading(
      `${colors.blue}Fetching stations from API${colors.reset}`,
    );
    let offset = 0;
    let hasMoreData = true;

    while (hasMoreData) {
      const stations = await api.searchStations({
        reverse: true,
        offset,
        limit: BATCH_SIZE,
      });
      stopStationsLoading();

      if (!stations.length) {
        hasMoreData = false;
        break;
      }

      for (const station of stations) {
        const country = await db.query.countries.findFirst({
          where: (c, { eq }) => eq(c.iso, station.countryCode),
          hideBroken: true,
        });
        if (!country) continue;

        const normalizedName = normalizeRadioName(station.name);
        if (!normalizedName.trim()) continue;

        await db
          .insert(schema.radios)
          .values({
            id: station.id,
            radioName: normalizedName,
            url: station.url,
            favicon: station.favicon,
            countryId: country.id,
            radioTags: JSON.stringify(station.tags || []),
            radioLanguage: JSON.stringify(station.language || []),
          })
          .onConflictDoUpdate({
            target: [schema.radios.id],
            set: {
              radioName: normalizedName,
              url: station.url,
              favicon: station.favicon,
              countryId: country.id,
              radioTags: JSON.stringify(station.tags || []),
              radioLanguage: JSON.stringify(station.language || []),
            },
          });
        console.log("Inserted or updated:" + offset);
      }
      offset += BATCH_SIZE;
    }

    //   const stations = await api.searchStations({ reverse: true });
    //   stopStationsLoading();

    //   console.log(
    //     `${colors.yellow}Inserting stations into database...${colors.reset}`,
    //   );
    //   for (const station of stations) {
    //     const country = await db.query.countries.findFirst({
    //       where: (c, { eq }) => eq(c.iso, station.countryCode),
    //       hideBroken: true,
    //     });
    //     if (!country) continue;

    //     const normalizedName = normalizeRadioName(station.name);
    //     if (!normalizedName.trim()) continue;

    //     await db.insert(schema.radios).values({
    //       id: station.id,
    //       radioName: normalizeRadioName(station.name),
    //       url: station.url,
    //       favicon: station.favicon,
    //       countryId: country.id,
    //       radioTags: JSON.stringify(station.tags || []),
    //       radioLanguage: JSON.stringify(station.language || []),
    //     });
    //   }
    //   console.log(`${colors.darkGreen}Stations sync completed!${colors.reset}`);
  }
  console.log(
    `${colors.orange}\nSynchronization completed successfully!\n${colors.reset}`,
  );
}
