# Pronto Sync App

This is the **Sync** app for the Pronto project.  
It synchronizes radio data (genres, countries, stations) from the [RadioBrowser API](https://www.radio-browser.info) into your local database.

---

## Features

- Fetches and stores genres, countries, and radio stations.
- Populates your local SQLite database using [drizzle-orm](https://orm.drizzle.team/).
- Command-line interface for flexible sync operations.

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
node sync.cli.js [all|genres|countries|stations]
```

- `all` (default): Syncs genres, countries, and stations.
- `genres`: Syncs only genres.
- `countries`: Syncs only countries.
- `stations`: Syncs only stations.

**Example:**

```sh
node sync.cli.js genres
```

---

## Configuration

- The database file name can be set with the `DB_NAME` environment variable.  
  Defaults to `local.db` if not set.

---

## Development

- The sync logic is in `sync.js`.
- The CLI entry point is `sync.cli.js`.
- Database schema is in `db/schema.js`.

---

## License

MIT