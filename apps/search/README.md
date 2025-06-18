# Pronto Search Service

A high-performance search engine for Radio Pronto built with [Orama](https://orama.com) - a fast, full-text and vector search engine written in TypeScript.

## Overview

This service provides a dedicated search API that indexes radios, countries, and genres from the local database using Orama's search capabilities. It runs as a separate HTTP server and provides better search performance compared to SQL-based search.

## Features

- **Fast Full-Text Search**: Powered by Orama's high-performance search engine
- **Multi-Entity Search**: Search across radios, countries, and genres simultaneously
- **Score-Based Ranking**: Results are ranked by relevance score
- **Fuzzy Search**: Tolerant to typos and spelling mistakes
- **Auto-Completion**: Optimized for search-as-you-type experiences
- **RESTful API**: Simple HTTP endpoints for easy integration

## Installation

The service is automatically installed when you run `yarn install` from the project root.

## Usage

### Starting the Service

```bash
# Development mode (with file watching)
yarn workspace @pronto/search dev

# Production mode
yarn workspace @pronto/search start
```

The service will start on `http://localhost:3001` by default.

### Environment Variables

- `PORT`: Server port (default: 3001)
- `DB_FILE_NAME`: Path to the SQLite database file
- `SEARCH_SERVICE_URL`: URL for the search service (used by web app)

### API Endpoints

#### Search
```
GET /search?q=<query>
```

**Parameters:**
- `q` (string): Search query

**Response:**
```json
{
  "radios": [
    {
      "id": "radio_id",
      "name": "Radio Name",
      "url": "stream_url",
      "country": "Country Name",
      "countryId": "country_id",
      "tags": ["genre1", "genre2"],
      "language": ["English"],
      "favicon": "favicon_url",
      "score": 0.95
    }
  ],
  "countries": [
    {
      "id": "country_id",
      "name": "Country Name",
      "iso": "US",
      "score": 0.85
    }
  ],
  "genres": ["Rock", "Pop", "Jazz"],
  "total": 25,
  "query": "rock music",
  "searchTime": "2.1ms"
}
```

#### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "Pronto Search Engine",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Reload Data
```
POST /reload
```

Reloads all data from the database into the search index.

**Response:**
```json
{
  "success": true,
  "message": "Data reloaded successfully"
}
```

## Integration with Web App

The main web application (`apps/web`) automatically proxies search requests to this service through the `/api/search` endpoint. The search service URL can be configured via the `SEARCH_SERVICE_URL` environment variable.

## Data Indexing

The service indexes the following data from your local database:

### Radios
- Radio name, URL, favicon
- Country information
- Tags (genres)
- Languages
- Combined search content for better matching

### Countries
- Country name and ISO code
- Full-text searchable

### Genres
- Extracted from radio tags and languages
- Deduplicated and indexed separately

## Performance

- **In-Memory Search**: All data is loaded into memory for ultra-fast search
- **Optimized Indexing**: Uses Orama's optimized data structures
- **Relevance Scoring**: Advanced scoring algorithm for better results
- **Fuzzy Search**: Tolerance for typos and variations

## Development

### Project Structure
```
apps/search/
├── index.js          # Main server file
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

### Adding New Search Features

To extend the search functionality:

1. Modify the Orama schema in `initializeOrama()`
2. Update the data loading logic in `loadDataIntoOrama()`
3. Adjust the search endpoint to handle new result types

### Debugging

Enable detailed logging by setting the environment variable:
```bash
DEBUG=pronto:search
```

## Troubleshooting

### Service Won't Start
- Check if port 3001 is available
- Verify database file path is correct
- Ensure all dependencies are installed

### Search Results Empty
- Verify data is loaded correctly (check startup logs)
- Try the `/reload` endpoint to refresh data
- Check database connectivity

### Performance Issues
- Monitor memory usage (all data is in-memory)
- Consider pagination for large result sets
- Review search query complexity

## Contributing

When contributing to the search service:

1. Follow the existing code style
2. Add appropriate error handling
3. Update this README if adding new features
4. Test with various search queries