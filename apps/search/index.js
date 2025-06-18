import express from "express";
import cors from "cors";
import { create, insert, search } from "@orama/orama";
import setup from "@pronto/db";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.SEARCH_SERVICE_PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database connection
const { db, schema } = setup({
  filePath: process.env.DB_FILE_NAME,
});

// Initialize Orama database
let oramaDb;

// Initialize Orama search database
async function initializeOrama() {
  console.log("🔍 Initializing Orama search engine...");

  try {
    // Create Orama database with schema
    oramaDb = await create({
      schema: {
        id: "string",
        name: "string",
        type: "string", // 'radio', 'country', 'genre'
        // Radio specific fields
        url: "string",
        country: "string",
        countryId: "string",
        tags: "string[]",
        language: "string[]",
        favicon: "string",
        // Country specific fields
        iso: "string",
        // Combined search field for better search results
        searchContent: "string",
      },
    });

    // Load data from local database
    await loadDataIntoOrama();

    console.log("✅ Orama search engine initialized successfully!");
  } catch (error) {
    console.error("❌ Failed to initialize Orama:", error);
    process.exit(1);
  }
}

// Load data from local database into Orama
async function loadDataIntoOrama() {
  console.log("📊 Loading data into Orama...");

  try {
    // Load radios
    const radios = await db
      .select({
        id: schema.radios.id,
        name: schema.radios.radioName,
        url: schema.radios.url,
        country: schema.countries.countryName,
        countryId: schema.radios.countryId,
        tags: schema.radios.radioTags,
        language: schema.radios.radioLanguage,
        favicon: schema.radios.favicon,
      })
      .from(schema.radios)
      .leftJoin(
        schema.countries,
        eq(schema.radios.countryId, schema.countries.id)
      )
      .where(eq(schema.radios.isDeleted, 0));

    console.log(`📻 Loading ${radios.length} radios...`);

    for (const radio of radios) {
      const tags = parseJsonField(radio.tags);
      const languages = parseJsonField(radio.language);

      await insert(oramaDb, {
        id: radio.id,
        name: radio.name,
        type: "radio",
        url: radio.url || "",
        country: radio.country || "",
        countryId: radio.countryId || "",
        tags: tags,
        language: languages,
        favicon: radio.favicon || "",
        searchContent: `${radio.name} ${radio.country || ""} ${tags.join(
          " "
        )} ${languages.join(" ")}`,
      });
    }

    // Load countries
    const countries = await db
      .select({
        id: schema.countries.id,
        name: schema.countries.countryName,
        iso: schema.countries.iso,
      })
      .from(schema.countries)
      .where(eq(schema.countries.isDeleted, 0));

    console.log(`🌍 Loading ${countries.length} countries...`);

    for (const country of countries) {
      await insert(oramaDb, {
        id: country.id,
        name: country.name,
        type: "country",
        url: "",
        country: country.name,
        countryId: country.id,
        tags: [],
        language: [],
        iso: country.iso,
        favicon: "",
        searchContent: `${country.name} ${country.iso}`,
      });
    }

    // Load unique genres from radios
    console.log("🎵 Processing genres...");
    const genresSet = new Set();
    const languagesSet = new Set();

    for (const radio of radios) {
      const tags = parseJsonField(radio.tags);
      const languages = parseJsonField(radio.language);

      tags.forEach((tag) => {
        if (tag && tag.trim()) {
          genresSet.add(tag.trim());
        }
      });

      languages.forEach((lang) => {
        if (lang && lang.trim()) {
          languagesSet.add(lang.trim());
        }
      });
    }

    // Insert genres
    let genreId = 1;
    for (const genre of genresSet) {
      await insert(oramaDb, {
        id: `genre_${genreId++}`,
        name: genre,
        type: "genre",
        url: "",
        country: "",
        countryId: "",
        tags: [genre],
        language: [],
        iso: "",
        favicon: "",
        searchContent: genre,
      });
    }

    // Insert languages as genres
    for (const language of languagesSet) {
      await insert(oramaDb, {
        id: `language_${genreId++}`,
        name: language,
        type: "genre",
        url: "",
        country: "",
        countryId: "",
        tags: [],
        language: [language],
        iso: "",
        favicon: "",
        searchContent: language,
      });
    }

    console.log(`✅ Data loaded successfully:`);
    console.log(`   📻 ${radios.length} radios`);
    console.log(`   🌍 ${countries.length} countries`);
    console.log(`   🎵 ${genresSet.size + languagesSet.size} genres/languages`);
  } catch (error) {
    console.error("❌ Failed to load data into Orama:", error);
    throw error;
  }
}

// Helper function to parse JSON fields safely
function parseJsonField(field) {
  if (!field) return [];
  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

// Import eq function from drizzle-orm
import { eq } from "drizzle-orm";

// Search endpoint
app.get("/search", async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.json({
        radios: [],
        genres: [],
        countries: [],
        total: 0,
        query: "",
      });
    }

    console.log(`🔍 Searching for: "${query}"`);

    // Perform search with Orama
    const searchResults = await search(oramaDb, {
      term: query,
      limit: 50,
      tolerance: 1,
      boost: {
        name: 2.0,
        searchContent: 1.5,
      },
    });

    // Organize results by type
    const radios = [];
    const countries = [];
    const genres = [];

    for (const hit of searchResults.hits) {
      const doc = hit.document;

      switch (doc.type) {
        case "radio":
          radios.push({
            id: doc.id,
            name: doc.name,
            url: doc.url,
            country: doc.country,
            countryId: doc.countryId,
            tags: doc.tags,
            language: doc.language,
            favicon: doc.favicon,
            score: hit.score,
          });
          break;

        case "country":
          countries.push({
            id: doc.id,
            name: doc.name,
            iso: doc.iso,
            score: hit.score,
          });
          break;

        case "genre":
          genres.push({
            name: doc.name,
            type: doc.tags.length > 0 ? "tag" : "language",
            score: hit.score,
          });
          break;
      }
    }

    // Remove duplicates and sort by score
    const uniqueGenres = Array.from(
      new Map(genres.map((g) => [g.name, g])).values()
    ).sort((a, b) => b.score - a.score);

    const response = {
      radios: radios.sort((a, b) => b.score - a.score),
      countries: countries.sort((a, b) => b.score - a.score),
      genres: uniqueGenres.map((g) => g.name),
      total: searchResults.hits.length,
      query: query,
      searchTime: `${searchResults.elapsed.formatted}`,
    };

    console.log(
      `✅ Search completed: ${response.total} results in ${response.searchTime}`
    );

    res.json(response);
  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).json({
      error: "Search failed",
      message: error.message,
      radios: [],
      genres: [],
      countries: [],
      total: 0,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Pronto Search Engine",
    timestamp: new Date().toISOString(),
  });
});

// Reload data endpoint (for manual refresh)
app.post("/reload", async (req, res) => {
  try {
    console.log("🔄 Reloading search data...");
    await loadDataIntoOrama();
    res.json({ success: true, message: "Data reloaded successfully" });
  } catch (error) {
    console.error("❌ Failed to reload data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to reload data",
      message: error.message,
    });
  }
});

// Start server
async function startServer() {
  try {
    await initializeOrama();

    app.listen(PORT, () => {
      console.log("🚀 Pronto Search Engine started!");
      console.log(`🌐 Server running on http://localhost:${PORT}`);
      console.log(
        `🔍 Search endpoint: http://localhost:${PORT}/search?q=your-query`
      );
      console.log(`❤️  Health check: http://localhost:${PORT}/health`);
      console.log(`🔄 Reload data: POST http://localhost:${PORT}/reload`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 Shutting down search engine...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("👋 Shutting down search engine...");
  process.exit(0);
});

// Start the server
startServer();
