import { GoogleTrendSearch } from "../common/GoogleTrend.interface";
import { ISO3166Alpha2 } from "../common/countriesIsoCode.type";

interface funcParams {
  country_iso?: ISO3166Alpha2;
  category?: string;
}

export async function fetchTrendingSearches({
  country_iso = "US",
  category= "all",
}: funcParams
): Promise<GoogleTrendSearch> {

  const response = await fetch(`https://trends.google.com/trends/api/dailytrends?geo=${country_iso}&category=${category}&hl=en-US`);

  const rawResponse = await response.text();

  // remove the first 5 characters from the response ")]}',"
  return JSON.parse(rawResponse.slice(5)) as GoogleTrendSearch;

}
