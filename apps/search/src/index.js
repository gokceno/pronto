"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var orama_1 = require("@orama/orama");
var db_1 = require("@pronto/db");
var dotenv_1 = require("dotenv");
var path_1 = require("path");
var url_1 = require("url");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
// Load environment variables
dotenv_1.default.config();
// Orama schema definition
var oramaSchema = {
    id: "string",
    name: "string",
    type: "string",
    url: "string",
    country: "string",
    countryId: "string",
    tags: "string[]",
    language: "string[]",
    favicon: "string",
    iso: "string",
    searchContent: "string",
};
var app = (0, express_1.default)();
var PORT = parseInt(process.env.SEARCH_SERVICE_PORT || "3001");
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize database connection
var _a = (0, db_1.default)({
    filePath: process.env.DB_FILE_NAME,
}), db = _a.db, schema = _a.schema;
// Import eq function from drizzle-orm
var drizzle_orm_1 = require("drizzle-orm");
// Initialize Orama database
var oramaDb;
// Initialize Orama search database
function initializeOrama() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🔍 Initializing Orama search engine...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, orama_1.create)({
                            schema: oramaSchema,
                        })];
                case 2:
                    // Create Orama database with schema
                    oramaDb = _a.sent();
                    // Load data from local database
                    return [4 /*yield*/, loadDataIntoOrama()];
                case 3:
                    // Load data from local database
                    _a.sent();
                    console.log("✅ Orama search engine initialized successfully!");
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("❌ Failed to initialize Orama:", error_1);
                    process.exit(1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Reinitialize Orama search database (clears existing data)
function reinitializeOrama() {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🔄 Reinitializing Orama search engine...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    // Create fresh Orama database with schema (this clears existing data)
                    console.log("🗑️  Clearing existing search index...");
                    return [4 /*yield*/, (0, orama_1.create)({
                            schema: oramaSchema,
                        })];
                case 2:
                    oramaDb = _a.sent();
                    // Load fresh data from local database
                    return [4 /*yield*/, loadDataIntoOrama()];
                case 3:
                    // Load fresh data from local database
                    _a.sent();
                    console.log("✅ Orama search engine reinitialized successfully!");
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error("❌ Failed to reinitialize Orama:", error_2);
                    throw error_2;
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Load data from local database into Orama
function loadDataIntoOrama() {
    return __awaiter(this, void 0, void 0, function () {
        var radios, _i, radios_1, radio, tags, languages, countries, _a, countries_1, country, genresSet_2, languagesSet_2, _b, radios_2, radio, tags, languages, genreId, _c, genresSet_1, genre, _d, languagesSet_1, language, error_3;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    console.log("📊 Loading data into Orama...");
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 20, , 21]);
                    return [4 /*yield*/, db
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
                            .leftJoin(schema.countries, (0, drizzle_orm_1.eq)(schema.radios.countryId, schema.countries.id))
                            .where((0, drizzle_orm_1.eq)(schema.radios.isDeleted, 0))];
                case 2:
                    radios = _e.sent();
                    console.log("\uD83D\uDCFB Loading ".concat(radios.length, " radios..."));
                    _i = 0, radios_1 = radios;
                    _e.label = 3;
                case 3:
                    if (!(_i < radios_1.length)) return [3 /*break*/, 6];
                    radio = radios_1[_i];
                    tags = parseJsonField(radio.tags);
                    languages = parseJsonField(radio.language);
                    return [4 /*yield*/, (0, orama_1.insert)(oramaDb, {
                            id: radio.id,
                            name: radio.name,
                            type: "radio",
                            url: radio.url || "",
                            country: radio.country || "",
                            countryId: radio.countryId || "",
                            tags: tags,
                            language: languages,
                            favicon: radio.favicon || "",
                            iso: "",
                            searchContent: "".concat(radio.name, " ").concat(radio.country || "", " ").concat(tags.join(" "), " ").concat(languages.join(" ")),
                        })];
                case 4:
                    _e.sent();
                    _e.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [4 /*yield*/, db
                        .select({
                        id: schema.countries.id,
                        name: schema.countries.countryName,
                        iso: schema.countries.iso,
                    })
                        .from(schema.countries)
                        .where((0, drizzle_orm_1.eq)(schema.countries.isDeleted, 0))];
                case 7:
                    countries = _e.sent();
                    console.log("\uD83C\uDF0D Loading ".concat(countries.length, " countries..."));
                    _a = 0, countries_1 = countries;
                    _e.label = 8;
                case 8:
                    if (!(_a < countries_1.length)) return [3 /*break*/, 11];
                    country = countries_1[_a];
                    return [4 /*yield*/, (0, orama_1.insert)(oramaDb, {
                            id: country.id,
                            name: country.name,
                            type: "country",
                            url: "",
                            country: country.name,
                            countryId: country.id,
                            tags: [],
                            language: [],
                            favicon: "",
                            iso: country.iso,
                            searchContent: "".concat(country.name, " ").concat(country.iso),
                        })];
                case 9:
                    _e.sent();
                    _e.label = 10;
                case 10:
                    _a++;
                    return [3 /*break*/, 8];
                case 11:
                    // Load unique genres from radios
                    console.log("🎵 Processing genres...");
                    genresSet_2 = new Set();
                    languagesSet_2 = new Set();
                    for (_b = 0, radios_2 = radios; _b < radios_2.length; _b++) {
                        radio = radios_2[_b];
                        tags = parseJsonField(radio.tags);
                        languages = parseJsonField(radio.language);
                        tags.forEach(function (tag) {
                            if (tag && tag.trim()) {
                                genresSet_2.add(tag.trim());
                            }
                        });
                        languages.forEach(function (lang) {
                            if (lang && lang.trim()) {
                                languagesSet_2.add(lang.trim());
                            }
                        });
                    }
                    genreId = 1;
                    _c = 0, genresSet_1 = genresSet_2;
                    _e.label = 12;
                case 12:
                    if (!(_c < genresSet_1.length)) return [3 /*break*/, 15];
                    genre = genresSet_1[_c];
                    return [4 /*yield*/, (0, orama_1.insert)(oramaDb, {
                            id: "genre_".concat(genreId++),
                            name: genre,
                            type: "genre",
                            url: "",
                            country: "",
                            countryId: "",
                            tags: [genre],
                            language: [],
                            favicon: "",
                            iso: "",
                            searchContent: genre,
                        })];
                case 13:
                    _e.sent();
                    _e.label = 14;
                case 14:
                    _c++;
                    return [3 /*break*/, 12];
                case 15:
                    _d = 0, languagesSet_1 = languagesSet_2;
                    _e.label = 16;
                case 16:
                    if (!(_d < languagesSet_1.length)) return [3 /*break*/, 19];
                    language = languagesSet_1[_d];
                    return [4 /*yield*/, (0, orama_1.insert)(oramaDb, {
                            id: "language_".concat(genreId++),
                            name: language,
                            type: "genre",
                            url: "",
                            country: "",
                            countryId: "",
                            tags: [],
                            language: [language],
                            favicon: "",
                            iso: "",
                            searchContent: language,
                        })];
                case 17:
                    _e.sent();
                    _e.label = 18;
                case 18:
                    _d++;
                    return [3 /*break*/, 16];
                case 19:
                    console.log("\u2705 Data loaded successfully:");
                    console.log("   \uD83D\uDCFB ".concat(radios.length, " radios"));
                    console.log("   \uD83C\uDF0D ".concat(countries.length, " countries"));
                    console.log("   \uD83C\uDFB5 ".concat(genresSet_2.size + languagesSet_2.size, " genres/languages"));
                    return [3 /*break*/, 21];
                case 20:
                    error_3 = _e.sent();
                    console.error("❌ Failed to load data into Orama:", error_3);
                    throw error_3;
                case 21: return [2 /*return*/];
            }
        });
    });
}
// Helper function to parse JSON fields safely
function parseJsonField(field) {
    if (!field)
        return [];
    try {
        var parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch (error) {
        return [];
    }
}
// Search endpoint
app.get("/search", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, searchResults, radios, countries, genres, _i, _a, hit, doc, uniqueGenres, response, error_4, errorMessage;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                query = (_b = req.query.q) === null || _b === void 0 ? void 0 : _b.trim();
                if (!query) {
                    return [2 /*return*/, res.json({
                            radios: [],
                            genres: [],
                            countries: [],
                            total: 0,
                            query: "",
                        })];
                }
                console.log("\uD83D\uDD0D Searching for: \"".concat(query, "\""));
                return [4 /*yield*/, (0, orama_1.search)(oramaDb, {
                        term: query,
                        limit: 50,
                        tolerance: 1,
                        boost: {
                            name: 2.0,
                            searchContent: 1.5,
                        },
                    })];
            case 1:
                searchResults = _c.sent();
                radios = [];
                countries = [];
                genres = [];
                for (_i = 0, _a = searchResults.hits; _i < _a.length; _i++) {
                    hit = _a[_i];
                    doc = hit.document;
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
                                iso: doc.iso || "",
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
                uniqueGenres = Array.from(new Map(genres.map(function (g) { return [g.name, g]; })).values()).sort(function (a, b) { return b.score - a.score; });
                response = {
                    radios: radios.sort(function (a, b) { return b.score - a.score; }),
                    countries: countries.sort(function (a, b) { return b.score - a.score; }),
                    genres: uniqueGenres.map(function (g) { return g.name; }),
                    total: searchResults.hits.length,
                    query: query,
                    searchTime: "".concat(searchResults.elapsed.formatted),
                };
                console.log("\u2705 Search completed: ".concat(response.total, " results in ").concat(response.searchTime));
                res.json(response);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _c.sent();
                console.error("❌ Search error:", error_4);
                errorMessage = error_4 instanceof Error ? error_4.message : "Unknown error";
                res.status(500).json({
                    error: "Search failed",
                    message: errorMessage,
                    radios: [],
                    genres: [],
                    countries: [],
                    total: 0,
                    query: req.query.q || "",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Health check endpoint
app.get("/health", function (req, res) {
    res.json({
        status: "ok",
        service: "Pronto Search Engine",
        timestamp: new Date().toISOString(),
    });
});
// Reload data endpoint (for manual refresh)
app.post("/reload", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5, errorMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log("🔄 Reloading search data...");
                return [4 /*yield*/, reinitializeOrama()];
            case 1:
                _a.sent();
                res.json({ success: true, message: "Data reloaded successfully" });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error("❌ Failed to reload data:", error_5);
                errorMessage = error_5 instanceof Error ? error_5.message : "Unknown error";
                res.status(500).json({
                    success: false,
                    error: "Failed to reload data",
                    message: errorMessage,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Start server
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        var error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, initializeOrama()];
                case 1:
                    _a.sent();
                    app.listen(PORT, function () {
                        console.log("🚀 Pronto Search Engine started!");
                        console.log("\uD83C\uDF10 Server running on http://localhost:".concat(PORT));
                        console.log("\uD83D\uDD0D Search endpoint: http://localhost:".concat(PORT, "/search?q=your-query"));
                        console.log("\u2764\uFE0F  Health check: http://localhost:".concat(PORT, "/health"));
                        console.log("\uD83D\uDD04 Reload data: POST http://localhost:".concat(PORT, "/reload"));
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    console.error("❌ Failed to start server:", error_6);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Handle graceful shutdown
process.on("SIGTERM", function () {
    console.log("👋 Shutting down search engine...");
    process.exit(0);
});
process.on("SIGINT", function () {
    console.log("👋 Shutting down search engine...");
    process.exit(0);
});
// Start the server
startServer();
