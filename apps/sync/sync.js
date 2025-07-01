import { RadioBrowserApi } from "radio-browser-api";
import setup from "@pronto/db";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const dbName = process.env.DB_FILE_NAME;
const { db, schema } = setup({ filePath: dbName });
const api = new RadioBrowserApi("PRONTO_SYNC");

// Pagination configuration
const BATCH_SIZE = 200;

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

  async function syncCountriesPaginated() {
    console.log(`${colors.cyan}\n-Starting countries sync with pagination-`);

    console.log(`${colors.blue}Deleting existing data...${colors.reset}`);
    await db.delete(schema.favorites);
    await db.delete(schema.usersListsRadios);
    await db.delete(schema.radios);
    await db.delete(schema.countries);

    let offset = 0;
    let totalCountries = 0;
    let hasMoreData = true;

    while (hasMoreData) {
      const stopCountriesLoading = startLoading(
        `${colors.blue}Fetching countries batch ${Math.floor(offset / BATCH_SIZE) + 1} (offset: ${offset})${colors.reset}`,
      );

      try {
        // Note: RadioBrowser API doesn't support limit/offset for countries directly
        // So we fetch all countries and implement client-side pagination
        const allCountries = await api.getCountries();
        stopCountriesLoading();

        const countriesBatch = allCountries.slice(offset, offset + BATCH_SIZE);

        if (countriesBatch.length === 0) {
          hasMoreData = false;
          break;
        }

        console.log(
          `${colors.yellow}Inserting ${countriesBatch.length} countries into database (batch ${Math.floor(offset / BATCH_SIZE) + 1})...${colors.reset}`,
        );

        for (const country of countriesBatch) {
          await db.insert(schema.countries).values({
            id: uuidv4(),
            countryName: country.name,
            iso: country.iso_3166_1,
          });
        }

        totalCountries += countriesBatch.length;
        offset += BATCH_SIZE;

        console.log(
          `${colors.darkGreen}Batch ${Math.floor((offset - BATCH_SIZE) / BATCH_SIZE) + 1} completed! (${totalCountries} countries processed so far)${colors.reset}`,
        );

        // If we got less than BATCH_SIZE items, we're done
        if (
          countriesBatch.length < BATCH_SIZE ||
          offset >= allCountries.length
        ) {
          hasMoreData = false;
        }

        // Small delay to prevent overwhelming the system
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        stopCountriesLoading();
        console.error(
          `${colors.red}Error fetching countries batch at offset ${offset}:${colors.reset}`,
          error,
        );
        throw error;
      }
    }

    console.log(
      `${colors.darkGreen}Countries sync completed! Total: ${totalCountries} countries${colors.reset}`,
    );
  }

  async function syncStationsPaginated() {
    console.log(`${colors.cyan}\n-Starting stations sync with local batching-`);

    console.log(`${colors.blue}Deleting existing radio data...${colors.reset}`);
    await db.delete(schema.favorites);
    await db.delete(schema.usersListsRadios);
    await db.delete(schema.radios);

    // Fetch all stations at once to avoid API pagination issues
    const stopStationsLoading = startLoading(
      `${colors.blue}Fetching all stations from API${colors.reset}`,
    );

    let allStations;
    try {
      allStations = await api.searchStations({ reverse: true });
      stopStationsLoading();
    } catch (error) {
      stopStationsLoading();
      console.error(
        `${colors.red}Error fetching stations from API:${colors.reset}`,
        error,
      );
      throw error;
    }

    console.log(
      `${colors.yellow}Fetched ${allStations.length} stations. Processing in batches of ${BATCH_SIZE}...${colors.reset}`,
    );

    let offset = 0;
    let totalStations = 0;
    let batchNumber = 1;

    while (offset < allStations.length) {
      const stationsBatch = allStations.slice(offset, offset + BATCH_SIZE);

      console.log(
        `${colors.yellow}Processing batch ${batchNumber} (${stationsBatch.length} stations, offset: ${offset})...${colors.reset}`,
      );

      let processedInBatch = 0;
      for (const station of stationsBatch) {
        const country = await db.query.countries.findFirst({
          where: (c, { eq }) => eq(c.iso, station.countryCode),
          hideBroken: true,
        });
        if (!country) continue;

        const normalizedName = normalizeRadioName(station.name);
        if (!normalizedName.trim()) continue;

        try {
          await db.insert(schema.radios).values({
            id: station.id,
            radioName: normalizeRadioName(station.name),
            url: station.url,
            favicon: station.favicon,
            countryId: country.id,
            radioTags: JSON.stringify(station.tags || []),
            radioLanguage: JSON.stringify(station.language || []),
          });

          processedInBatch++;
        } catch (error) {
          if (error.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
            // Handle duplicate ID gracefully - this shouldn't happen with this approach
            console.log(
              `${colors.yellow}Duplicate station ID ${station.id} skipped${colors.reset}`,
            );
          } else {
            throw error; // Re-throw other errors
          }
        }
      }

      totalStations += processedInBatch;
      offset += BATCH_SIZE;
      batchNumber++;

      console.log(
        `${colors.darkGreen}Batch ${batchNumber - 1} completed! (${processedInBatch}/${stationsBatch.length} stations inserted, ${totalStations} total)${colors.reset}`,
      );

      // Small delay to prevent overwhelming the database
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log(
      `${colors.darkGreen}Stations sync completed! Total: ${totalStations} stations processed from ${allStations.length} fetched${colors.reset}`,
    );
  }

  // Execute sync based on type
  if (type === "countries" || type === "all") {
    await syncCountriesPaginated();
  }

  if (type === "stations" || type === "all") {
    await syncStationsPaginated();
  }

  console.log(
    `${colors.orange}\nSynchronization completed successfully!\n${colors.reset}`,
  );
}
