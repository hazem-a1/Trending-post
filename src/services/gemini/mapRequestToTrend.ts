import { Article, GoogleTrendSearch, Trend, TrendingSearch } from "../../common/GoogleTrend.interface";


export function mapRequestToTrend(data: GoogleTrendSearch): Array<Trend> {
  const today = new Date(Date.now()).toDateString();
  return data.default.trendingSearchesDays[0].trendingSearches.map((trend: TrendingSearch) => {
    return {
      title: trend.title.query || "",
      traffic: trend.formattedTraffic || "",
      image: trend.image.imageUrl || "",
      date: today,
      articles: trend.articles.map((article: Article) => {
        return {
          title: article.title || "",
          source: article.source || "",
          url: article.url || "",
        };
      })
    };
  });
}
