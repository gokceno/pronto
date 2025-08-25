import OpenAI from "openai";
import { saveDescription, getDescription } from "./utils/save-description.js";

const OpenAIClient = ({ apiKey, systemPrompt }) => {
  const openai = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });
  const invoke = async ({ userPrompt }) => {
    try {
      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.5-flash-lite-preview-06-17",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      });
      const description = completion.choices[0].message.content.trim();
      return description === "null" ? null : description;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  return {
    invoke,
  };
};

export const description = async ({ input, type }) => {
  const normalizedId = input.toLowerCase().trim();
  const specialGenres = {
    news: "News and information radio stations providing current events, weather updates, and occasional music breaks.",
    talk: "Talk radio stations featuring discussions, interviews, and commentary on various topics.",
    sports:
      "Sports radio stations covering live games, sports news, analysis, and commentary.",
    weather:
      "Weather information stations providing forecasts and weather-related updates.",
    comedy:
      "Radio stations featuring comedy shows, stand-up performances, and humorous content.",
    business:
      "Business news and financial information radio stations covering markets, economy, and business trends.",
    music: "Music radio stations playing a variety of genres and artists.",
  };

  // Check database first
  const existingDescription = await getDescription({
    targetType: type,
    targetId: normalizedId,
  });

  if (existingDescription) {
    return existingDescription.content;
  }

  // Check special genres
  if (specialGenres[normalizedId]) {
    const description = specialGenres[normalizedId];
    // Save special genre description to database
    try {
      await saveDescription({
        targetType: type,
        targetId: normalizedId,
        title: `Genre: ${input}`,
        content: description,
      });
    } catch (error) {
      console.error(
        "Error saving special genre description to database:",
        error,
      );
    }
    return description;
  }

  const prompts = {
    system: {
      country:
        "You are a music expert who provides descriptions of countries' musical heritage. For any country name, create a description in the format: 'Listen to {adjective} beats from {Country}. {Attributes of the country related to music}'.",
      genre:
        "You are a music expert who provides concise, engaging descriptions of music genres in 2-3 sentences. Create an imaginative description focusing on musical characteristics, mood, and cultural elements as if it were an established genre.",
    },
    user: {
      country: `Create a musical description for ${input} in the format: 'Listen to {adjective} beats from ${input}. {Attributes of the country related to music}'.`,
      genre: `Write a brief, engaging description of the "${input}" music genre that captures its essence and musical characteristics.`,
    },
  };

  const openAI = OpenAIClient({
    apiKey: process.env.OPENROUTER_API_KEY,
    systemPrompt: prompts["system"][type],
  });
  const aiDescription = await openAI.invoke({
    userPrompt: prompts["user"][type],
  });

  if (aiDescription) {
    // Save AI-generated description to database
    try {
      await saveDescription({
        targetType: type,
        targetId: normalizedId,
        title: `${type === "country" ? "Country" : "Genre"}: ${input}`,
        content: aiDescription,
      });
    } catch (error) {
      console.error("Error saving AI description to database:", error);
    }
  }

  return aiDescription;
};
