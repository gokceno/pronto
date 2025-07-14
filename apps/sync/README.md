# Pronto Sync App

This is the **Sync** app for the Pronto project.  
It synchronizes radio data (countries, stations) from the [RadioBrowser API](https://www.radio-browser.info) into your local database using **pagination** for memory-efficient processing.

---

## Features

- **Paginated Data Fetching**: Processes data in batches of 200 items to reduce memory usage
- **Memory Efficient**: Avoids loading large datasets into memory all at once
- **Progress Tracking**: Shows real-time progress with batch-by-batch updates
- **Error Handling**: Robust error handling with detailed batch-level error reporting
- **Flexible Sync Options**: Sync countries, stations, or both
- **SQLite Integration**: Populates your local SQLite database using [drizzle-orm](https://orm.drizzle.team/)

---

## Pagination Implementation

The sync process uses a hybrid approach to handle large datasets efficiently:

### Countries Sync
- Fetches all countries from API and processes them in batches of 200
- Client-side pagination (RadioBrowser API doesn't support server-side pagination for countries)
- Progress tracking shows current batch and total processed

### Stations Sync  
- Fetches all stations from API in one request to avoid pagination issues
- Processes stations locally in batches of 200 items
- This approach avoids duplicate data issues that occur with API pagination
- Memory-efficient processing despite single API call

### Benefits
- **Reduced Memory Usage**: Processes data in batches of 200 items at a time
- **Better Progress Visibility**: See exactly how many items have been processed
- **Improved Reliability**: Avoids API pagination issues that cause duplicates
- **Graceful Error Handling**: Clear batch-level error reporting
- **No Duplicates**: Single API call eliminates duplicate station issues

---

## Usage

### 1. Install dependencies

```sh
cd apps/sync
yarn install
# or
npm install
```

### 2. Run the sync CLI

You can run the sync command with different options:

```sh
node sync.cli.js [all|countries|stations]
```

- `all` (default): Syncs countries and stations with pagination
- `countries`: Syncs only countries (200 per batch)
- `stations`: Syncs only stations (200 per batch)

**Examples:**

```sh
# Sync everything with pagination
node sync.cli.js all

# Sync only countries
node sync.cli.js countries

# Sync only stations  
node sync.cli.js stations
```

### Sample Output

```
Starting paginated synchronization for: all
Using batch size: 200 items per request
This approach reduces memory usage and provides better progress tracking

-Starting countries sync with pagination-
Deleting existing data...
Fetching countries batch 1 (offset: 0) |
Inserting 200 countries into database (batch 1)...
Batch 1 completed! (200 countries processed so far)
Fetching countries batch 2 (offset: 200) |
Inserting 45 countries into database (batch 2)...
Batch 2 completed! (245 countries processed so far)
Countries sync completed! Total: 245 countries

-Starting stations sync with pagination-
Deleting existing radio data...
Fetching stations batch 1 (offset: 0) |
Processing 200 stations (batch 1)...
Batch 1 completed! (198/200 stations inserted, 198 total)
Fetching stations batch 2 (offset: 200) |
Processing 200 stations (batch 2)...
Batch 2 completed! (195/200 stations inserted, 393 total)
...
Fetched 15847 stations. Processing in batches of 200...
Processing batch 1 (200 stations, offset: 0)...
Batch 1 completed! (198/200 stations inserted, 198 total)
Processing batch 2 (200 stations, offset: 200)...
Batch 2 completed! (195/200 stations inserted, 393 total)
...
Stations sync completed! Total: 15642 stations processed from 15847 fetched

Synchronization completed successfully!
```

---

## Configuration

- **Database File**: Set with the `DB_FILE_NAME` environment variable (defaults to `local.db`)
- **Batch Size**: Fixed at 200 items per batch (configurable in `sync.js` via `BATCH_SIZE` constant)
- **Delays**: Small delays between batches to prevent overwhelming the API and database

---

## Technical Details

### Pagination Strategy

**Countries**: 
- RadioBrowser API doesn't support pagination for countries endpoint
- Implementation: Fetch all countries, then slice into 200-item batches client-side
- Memory efficient as we process and insert each batch before moving to the next

**Stations**:
- Fetches all stations in a single API call to avoid pagination issues
- Processes stations locally in batches of 200 items
- This hybrid approach eliminates duplicate data issues found with API pagination
- More reliable than API pagination which can return overlapping results

### Error Handling
- Each batch is wrapped in try-catch blocks
- Detailed error messages include batch number and offset information
- Failed batches will stop the sync process with clear error reporting

### Performance Optimizations
- Small delays (100ms for countries, 100ms for stations) between batches
- Database transactions are handled per-item for better error recovery
- Progress indicators show real-time status
- Single API call for stations reduces network overhead

---

## Development

- **Main sync logic**: `sync.js` - Contains paginated sync functions
- **CLI entry point**: `sync.cli.js` - Command-line interface
- **Database schema**: Defined in `@pronto/db` package
- **Batch size**: Configurable via `BATCH_SIZE` constant (currently 200)

### Key Functions
- `syncCountriesPaginated()`: Handles paginated country synchronization
- `syncStationsPaginated()`: Handles hybrid station synchronization (single fetch, local batching)
- `normalizeRadioName()`: Cleans up radio station names

---

## Troubleshooting

### Common Issues

**Memory Issues**: The pagination approach should prevent memory issues, but if you still encounter them:
- Reduce `BATCH_SIZE` in `sync.js` (try 100 or 50)
- Ensure sufficient disk space for the SQLite database

**API Rate Limiting**: If you hit rate limits:
- Increase the delay between batches in the sync functions
- Current delays: 100ms (countries), 100ms (stations)
- Stations use single API call so rate limiting is less of an issue

**Network Timeouts**: For unstable connections:
- Countries: The pagination approach makes recovery easier - you'll know exactly which batch failed
- Stations: Single API call reduces timeout risk, but local batching makes processing recovery easier
- Simply restart the sync and it will begin fresh (existing data is cleared at start)

**Database Errors**: 
- Ensure the database file is writable
- Check that the `@pronto/db` package is properly installed
- Verify the database schema is up to date