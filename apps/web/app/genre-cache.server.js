import fs from 'fs/promises';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'genre-descriptions-cache.json');

// List of known non-music genres
const NON_MUSIC_GENRES = ['news', 'talk', 'sports', 'weather', 'comedy', 'business', 'music'];

async function readCache() {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

async function writeCache(cache) {
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

export async function getCachedDescription(genre) {
  const cache = await readCache();
  const normalizedGenre = genre.toLowerCase().trim();
  
  // If it's a non-music genre, always return null to use the translation key
  if (NON_MUSIC_GENRES.includes(normalizedGenre)) {
    return null;
  }
  
  return cache[normalizedGenre];
}

export async function setCachedDescription(genre, description) {
  const cache = await readCache();
  const normalizedGenre = genre.toLowerCase().trim();
  
  // Don't cache null descriptions or non-music genres
  if (description === null || NON_MUSIC_GENRES.includes(normalizedGenre)) {
    return description;
  }
  
  cache[normalizedGenre] = description;
  await writeCache(cache);
  return description;
}

export async function clearCache() {
  await writeCache({});
}
