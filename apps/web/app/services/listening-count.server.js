import { RadioBrowserApi } from "radio-browser-api";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { eq, and, inArray } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Initialize RadioBrowser API
const api = new RadioBrowserApi("ProntoRadioApp/1.0");

/**
 * Updates listening counts for stations that need updates (2+ hours since last update)
 * @param {string[]} stationIds - Array of station IDs to check and potentially update
 * @returns {Promise<Object>} Object mapping station IDs to their click counts
 */
export async function updateListeningCounts(stationIds) {
  if (!stationIds || stationIds.length === 0) {
    return {};
  }

  try {
    // Get existing records for all requested stations
    const existingRecords = await dbServer
      .select({
        id: dbSchema.radioListeningCounts.id,
        radioId: dbSchema.radioListeningCounts.radioId,
        lastUpdated: dbSchema.radioListeningCounts.lastUpdated,
        clickCount: dbSchema.radioListeningCounts.clickCount,
      })
      .from(dbSchema.radioListeningCounts)
      .where(inArray(dbSchema.radioListeningCounts.radioId, stationIds));

    // Check which stations need updates (2+ hours since last update)
    const now = new Date();
    const twoHoursInMs = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

    const stationsNeedingUpdate = existingRecords.filter((record) => {
      const lastUpdated = new Date(record.lastUpdated);
      const timeDiff = now.getTime() - lastUpdated.getTime();
      return timeDiff >= twoHoursInMs;
    });

    // Get stations that don't have records yet
    const existingIds = existingRecords.map((record) => record.radioId);
    const newStationIds = stationIds.filter((id) => !existingIds.includes(id));

    // Combine stations that need updates with new stations
    const stationsToUpdate = [
      ...stationsNeedingUpdate.map((s) => s.radioId),
      ...newStationIds,
    ];

    if (stationsToUpdate.length === 0) {
      // No stations need updating, return current counts
      return await getCurrentListeningCounts(stationIds);
    }

    // Get radio details from database to map to RadioBrowser API
    const radioDetails = await dbServer
      .select({
        id: dbSchema.radios.id,
        radioName: dbSchema.radios.radioName,
        url: dbSchema.radios.url,
      })
      .from(dbSchema.radios)
      .where(inArray(dbSchema.radios.id, stationsToUpdate));

    // Fetch updated counts from RadioBrowser API
    const updatedCounts = {};

    try {
      // Make a single batch API call for all station IDs
      const stationIds = radioDetails.map((radio) => radio.id);
      const searchResults = await api.getStationsById(stationIds);
      // Create a map for quick lookup of API results
      const apiResultsMap = {};
      searchResults.forEach((station) => {
        apiResultsMap[station.id] = station.clickCount || 0;
      });

      // Process each radio and update database
      for (const radio of radioDetails) {
        const clickCount = apiResultsMap[radio.id] || 0;
        updatedCounts[radio.id] = clickCount;

        // Update or insert the listening count record
        const existingRecord = existingIds.includes(radio.id);

        if (existingRecord) {
          // Update existing record
          await dbServer
            .update(dbSchema.radioListeningCounts)
            .set({
              clickCount: clickCount,
              lastUpdated: new Date().toISOString(),
            })
            .where(eq(dbSchema.radioListeningCounts.radioId, radio.id));
        } else {
          // Insert new record
          await dbServer.insert(dbSchema.radioListeningCounts).values({
            id: uuidv4(),
            radioId: radio.id,
            clickCount: clickCount,
            lastUpdated: new Date().toISOString(),
          });
        }
      }
    } catch (apiError) {
      console.warn(`Failed to fetch click counts from API:`, apiError.message);

      // If batch API call fails, set all counts to 0 and still update database to reset timers
      for (const radio of radioDetails) {
        updatedCounts[radio.id] = 0;

        const existingRecord = existingIds.includes(radio.id);

        if (existingRecord) {
          await dbServer
            .update(dbSchema.radioListeningCounts)
            .set({
              clickCount: 0,
              lastUpdated: new Date().toISOString(),
            })
            .where(eq(dbSchema.radioListeningCounts.radioId, radio.id));
        } else {
          await dbServer.insert(dbSchema.radioListeningCounts).values({
            id: uuidv4(),
            radioId: radio.id,
            clickCount: 0,
            lastUpdated: new Date().toISOString(),
          });
        }
      }
    }

    // Get all current counts for the requested stations
    const allCounts = await getCurrentListeningCounts(stationIds);

    // Merge updated counts with existing counts
    const finalCounts = { ...allCounts, ...updatedCounts };
    return finalCounts;
  } catch (error) {
    console.error("Error updating listening counts:", error);
    // Return current counts if update fails
    return await getCurrentListeningCounts(stationIds);
  }
}

/**
 * Gets current listening counts from database for given station IDs
 * @param {string[]} stationIds - Array of station IDs
 * @returns {Promise<Object>} Object mapping station IDs to their click counts
 */
export async function getCurrentListeningCounts(stationIds) {
  if (!stationIds || stationIds.length === 0) {
    return {};
  }

  try {
    const counts = await dbServer
      .select({
        radioId: dbSchema.radioListeningCounts.radioId,
        clickCount: dbSchema.radioListeningCounts.clickCount,
      })
      .from(dbSchema.radioListeningCounts)
      .where(inArray(dbSchema.radioListeningCounts.radioId, stationIds));

    const result = {};
    counts.forEach((record) => {
      result[record.radioId] = record.clickCount || 0;
    });

    // Set 0 for stations that don't have records yet
    stationIds.forEach((id) => {
      if (!(id in result)) {
        result[id] = 0;
      }
    });

    return result;
  } catch (error) {
    console.error("Error fetching current listening counts:", error);
    // Return 0 for all stations if query fails
    const result = {};
    stationIds.forEach((id) => {
      result[id] = 0;
    });
    return result;
  }
}

/**
 * Gets listening count for a single station
 * @param {string} stationId - Station ID
 * @returns {Promise<number>} Click count for the station
 */
export async function getStationListeningCount(stationId) {
  const counts = await getCurrentListeningCounts([stationId]);
  return counts[stationId] || 0;
}
