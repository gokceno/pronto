import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateDescription(input) {
  const specialGenres = {
    news: "News and information radio stations providing current events, weather updates, and occasional music breaks.",
    talk: "Talk radio stations featuring discussions, interviews, and commentary on various topics.", 
    sports: "Sports radio stations covering live games, sports news, analysis, and commentary.",
    weather: "Weather information stations providing forecasts and weather-related updates.",
    comedy: "Radio stations featuring comedy shows, stand-up performances, and humorous content.",
    business: "Business news and financial information radio stations covering markets, economy, and business trends.",
    music: "Music radio stations playing a variety of genres and artists.",
  };

  try {
    const normalizedInput = input.toLowerCase().trim();
    if (specialGenres[normalizedInput]) {
      return specialGenres[normalizedInput];
    }

    // Check if input is a country code (2 letters)
    const isCountryCode = /^[A-Za-z]{2}$/.test(input);
    
    const systemPrompt = isCountryCode
      ? "You are a music expert who provides descriptions of countries' musical heritage. For any country code input (e.g., US, DE, TR), create a description in the format: 'Listen to {adjective} beats from {Country}. {Attributes of the country related to music}'."
      : "You are a music expert who provides concise, engaging descriptions of music genres in 2-3 sentences. Create an imaginative description focusing on musical characteristics, mood, and cultural elements as if it were an established genre.";

    const userPrompt = isCountryCode
      ? `Create a musical description for the country with code "${input}" in the format: 'Listen to {adjective} beats from {Country}. {Attributes of the country related to music}'.`
      : `Write a brief, engaging description of the "${input}" music genre that captures its essence and musical characteristics.`;

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

    const response = completion.choices[0].message.content.trim();
    return response === "null" ? null : response;
  } catch (error) {
    console.error('Error generating genre description:', error);
    return null;
  }
}