import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateGenreDescription(genre) {
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
    // Check if it's a special genre that needs a predefined description
    const normalizedGenre = genre.toLowerCase().trim();
    if (specialGenres[normalizedGenre]) {
      return specialGenres[normalizedGenre];
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a music expert who provides concise, engaging descriptions of music genres in 2-3 sentences. For any input, create an imaginative description focusing on musical characteristics, mood, and cultural elements as if it were an established genre."
        },
        {
          role: "user",
          content: `Write a brief, engaging description of the "${genre}" music genre that captures its essence and musical characteristics.`
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