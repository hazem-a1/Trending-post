import fs = require("node:fs");

import { TrendBlogPost } from "./common/GoogleTrend.interface";

import { generateBlogPost } from "./gemini/generateBlogPost";
import { mapRequestToTrend } from "./gemini/mapRequestToTrend";
import { fetchTrendingSearches } from "./google-trend/fetchTrendingSearches";


async function main() {
  const today = `${Date.now()}`
  const TrendingBlogPosts: Array<TrendBlogPost> = [];


  const trendingFetched = await fetchTrendingSearches({
    country_iso: "US",
    category: "all",
  });

  const trending = mapRequestToTrend(trendingFetched);

  for await (const trend of trending) {
    const blogPost = await generateBlogPost(trend.title);
    TrendingBlogPosts.push({ ...trend, blogPost });
  }

  // write the blog posts to a file named {today's date}
  fs.writeFileSync(`./data/${today}.json`, JSON.stringify(TrendingBlogPosts, null, 2));
}

try {
  main();
} catch (error) {
  console.error({error});
}