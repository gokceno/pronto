import { RadioBrowserApi } from "radio-browser-api";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@pronto/db/schema.js";
import { eq, and } from "drizzle-orm";
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
      console.log(`${colors.green}Done.${colors.reset}`);
    };
  }

  if (type === "countries" || type === "all") {
    console.log(`${colors.cyan}\n-Starting countries sync-`);

    // 1. Countries
    const stopCountriesLoading = startLoading(
      `${colors.blue}Fetching countries from API\n${colors.reset}`,
    );
    const countries = await api.getCountries();
    stopCountriesLoading();

    console.log(
      `${colors.yellow}Syncing countries with database...${colors.reset}`,
    );

    // Get existing countries from DB
    const existingCountries = await db.query.countries.findMany({
      where: eq(schema.countries.isDeleted, 0),
    });

    // Create maps for comparison
    const apiCountriesMap = new Map(countries.map((c) => [c.iso_3166_1, c]));
    const dbCountriesMap = new Map(existingCountries.map((c) => [c.iso, c]));

    let insertedCount = 0;
    let updatedCount = 0;
    let deletedCount = 0;

    // Process countries from API
    for (const country of countries) {
      const existingCountry = dbCountriesMap.get(country.iso_3166_1);

      if (!existingCountry) {
        // Insert new country
        await db.insert(schema.countries).values({
          id: uuidv4(),
          countryName: country.name,
          iso: country.iso_3166_1,
          isDeleted: 0,
        });
        insertedCount++;
      } else if (existingCountry.countryName !== country.name) {
        // Update changed country
        await db
          .update(schema.countries)
          .set({
            countryName: country.name,
            isDeleted: 0,
          })
          .where(eq(schema.countries.id, existingCountry.id));
        updatedCount++;
      }
    }

    // Mark countries not in API as deleted
    for (const [iso, dbCountry] of dbCountriesMap) {
      if (!apiCountriesMap.has(iso)) {
        await db
          .update(schema.countries)
          .set({ isDeleted: 1 })
          .where(eq(schema.countries.id, dbCountry.id));
        deletedCount++;
      }
    }

    console.log(
      `${colors.darkGreen}Countries sync completed! Inserted: ${insertedCount}, Updated: ${updatedCount}, Deleted: ${deletedCount}${colors.reset}`,
    );
  }

  if (type === "stations" || type === "all") {
    console.log(`${colors.cyan}\n-Starting stations sync-`);

    // 2. Stations (Radios)
    console.log(
      `${colors.blue}Fetching all stations from API to track changes...${colors.reset}`,
    );

    let offset = 0;
    let hasMoreData = true;
    const apiStationIds = new Set();
    let totalProcessed = 0;

    while (hasMoreData) {
      const stopStationsLoading = startLoading(
        `${colors.blue}Fetching stations batch (offset: ${offset})\n${colors.reset}`,
      );

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
        apiStationIds.add(station.id);

        const country = await db.query.countries.findFirst({
          where: and(
            eq(schema.countries.iso, station.countryCode),
            eq(schema.countries.isDeleted, 0),
          ),
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
            userScore: station.clickCount || 0,
            isDeleted: 0,
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
              userScore: station.clickCount || 0,
              isDeleted: 0,
            },
          });
      }

      totalProcessed += stations.length;
      console.log(`Processed: ${totalProcessed} stations`);
      offset += BATCH_SIZE;
    }

    // Mark stations not in API as deleted
    console.log(
      `${colors.yellow}Marking missing stations as deleted...${colors.reset}`,
    );

    const existingStations = await db.query.radios.findMany({
      where: eq(schema.radios.isDeleted, 0),
      columns: { id: true },
    });

    let deletedCount = 0;
    for (const existingStation of existingStations) {
      if (!apiStationIds.has(existingStation.id)) {
        await db
          .update(schema.radios)
          .set({ isDeleted: 1 })
          .where(eq(schema.radios.id, existingStation.id));
        deletedCount++;
      }
    }

    console.log(
      `${colors.darkGreen}Stations sync completed! Total processed: ${totalProcessed}, Marked as deleted: ${deletedCount}${colors.reset}`,
    );
  }
  console.log(
    `${colors.orange}\nSynchronization completed successfully!\n${colors.reset}`,
  );
}
