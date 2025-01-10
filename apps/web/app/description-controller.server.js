import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';

const Cache = () => {
  const CACHE_FILE = path.join(process.cwd(),'cache', 'cache.json');

  const get = async (id) => {
    try {
      const data = await fs.readFile(CACHE_FILE, 'utf8');
      const cacheData = JSON.parse(data);
      const normalizedId = id.toLowerCase().trim();
      return cacheData[normalizedId];
    } catch (error) {
      return null;
    }
  };

  const set = async (id, data) => {
    try {
      const normalizedId = id.toLowerCase().trim();
      
      if (data === null) {
        return data;
      }

      let cacheData = {};
      try {
        const fileData = await fs.readFile(CACHE_FILE, 'utf8');
        cacheData = JSON.parse(fileData);
      } catch (error) {
        // If file doesn't exist or is invalid, start with empty cache
      }

      cacheData[normalizedId] = data;
      await fs.writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2));
      return data;
    } catch (error) {
      console.error('Error setting cache:', error);
      return data;
    }
  };

  const is = async (id) => {
    try {
      const data = await fs.readFile(CACHE_FILE, 'utf8');
      const cacheData = JSON.parse(data);
      return id.toLowerCase().trim() in cacheData;
    } catch (error) {
      return false;
    }
  };

  return {
    get,
    set,
    is
  };
};

const OpenAIClient = ({ apiKey, systemPrompt }) => {
  const openai = new OpenAI({
    apiKey
  });

  const invoke = async ({ contexts, userPrompt }) => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
      });

      const description = completion.choices[0].message.content.trim();
      return description === "null" ? null : description;
    } catch (error) {
      console.error('Error generating description:', error);
      return null;
    }
  };

  return {
    invoke
  };
};



export const description = async ({ input, type }) => {
   const specialGenres = {
    news: "News and information radio stations providing current events, weather updates, and occasional music breaks.",
    talk: "Talk radio stations featuring discussions, interviews, and commentary on various topics.", 
    sports: "Sports radio stations covering live games, sports news, analysis, and commentary.",
    weather: "Weather information stations providing forecasts and weather-related updates.",
    comedy: "Radio stations featuring comedy shows, stand-up performances, and humorous content.",
    business: "Business news and financial information radio stations covering markets, economy, and business trends.",
    music: "Music radio stations playing a variety of genres and artists.",
  };
  
  const NON_MUSIC_GENRES = ['news', 'talk', 'sports', 'weather', 'comedy', 'business', 'music'];
  const cache = Cache();

  if (await cache.is(input)) {
    return await cache.get(input);
  }

  if (specialGenres[normalizedInput]) {
    const description = specialGenres[normalizedInput];
    await cache.set(normalizedInput, description);
    return description;
  }

  const isCountryName = type === 'country';
  const systemPrompt = isCountryName
    ? "You are a music expert who provides descriptions of countries' musical heritage. For any country name, create a description in the format: 'Listen to {adjective} beats from {Country}. {Attributes of the country related to music}'."
    : "You are a music expert who provides concise, engaging descriptions of music genres in 2-3 sentences. Create an imaginative description focusing on musical characteristics, mood, and cultural elements as if it were an established genre.";

  const userPrompt = isCountryName
    ? `Create a musical description for ${input} in the format: 'Listen to {adjective} beats from ${input}. {Attributes of the country related to music}'.`
    : `Write a brief, engaging description of the "${input}" music genre that captures its essence and musical characteristics.`;

  const openAI = OpenAIClient({  apiKey: process.env.OPENAI_API_KEY, systemPrompt });
  const description = await openAI.invoke({ contexts: [], userPrompt });
  return await cache.set(normalizedInput, description);
};

export default Cache();