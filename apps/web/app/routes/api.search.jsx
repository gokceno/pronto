// pronto/apps/web/app/routes/api.search.jsx
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() || "";

  if (!q) {
    return json({ radios: [], genres: [], countries: [] });
  }

  try {
    // Call Orama search service
    const searchServiceUrl = process.env.SEARCH_SERVICE_URL;
    const response = await fetch(
      `${searchServiceUrl}/search?q=${encodeURIComponent(q)}`,
    );

    if (!response.ok) {
      throw new Error(
        `Search service responded with status: ${response.status}`,
      );
    }

    const searchResults = await response.json();

    return json({
      radios: searchResults.radios || [],
      genres: searchResults.genres || [],
      countries: searchResults.countries || [],
    });
  } catch (error) {
    console.error("Search service error:", error);

    return json(
      {
        radios: [],
        genres: [],
        countries: [],
        error: "Search service temporarily unavailable",
      },
      { status: 503 },
    );
  }
};
