import { TrendBlogPostDAO } from "./DAO/postDAOs";
import { TrendBlogPost } from "./common/GoogleTrend.interface";

import { generateBlogPost } from "./services/gemini/generateBlogPost";
import { mapRequestToTrend } from "./services/gemini/mapRequestToTrend";
import { fetchTrendingSearches } from "./services/google-trend/fetchTrendingSearches";

const trendingPostDao = new TrendBlogPostDAO();

export async function app() {
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
  // save to db
  await trendingPostDao.insertMany(TrendingBlogPosts);
}

function main() {
 // get post from db
  // get all posts
  trendingPostDao.read().then((posts) => {
    console.log(posts);
  }).catch((err) => {
    console.log(err);
  });

}

main();