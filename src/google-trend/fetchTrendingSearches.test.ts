import { fetchTrendingSearches } from "./fetchTrendingSearches";

describe('fetchTrendingSearches', () => {
  test('should fetch trending searches for the given country and category', async () => {
    const country_iso = "US";
    const category = "all";

    const result = await fetchTrendingSearches({ country_iso, category });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("default");
    expect(result.default).toHaveProperty("trendingSearchesDays");
    expect(result.default.trendingSearchesDays).toBeInstanceOf(Array);
  });

  test('should fetch trending searches with default parameters if not provided', async () => {
    const result = await fetchTrendingSearches({});

    expect(result).toBeDefined();
    expect(result).toHaveProperty("default");
    expect(result.default).toHaveProperty("trendingSearchesDays");
    expect(result.default.trendingSearchesDays).toBeInstanceOf(Array);
  });
});