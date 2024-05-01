export interface GoogleTrendSearch {
    default: {
        trendingSearchesDays: Array<TrendingSearchesDays>;
    }
}

interface TrendingSearchesDays {
    trendingSearches: Array<TrendingSearch>;
}

export interface TrendingSearch {
    title: {
        query: string;
    };
    formattedTraffic: string;
    image: {
        imageUrl: string;
    };
    articles: Array<Article>;
}

export interface Article {
    title: string;
    source: string;
    url: string;
}

export interface Trend {
    title: string;
    traffic: string;
    image: string;
    date: string;
    articles: Array<Article>;
}


export interface TrendBlogPost extends Trend {
    blogPost: string;
    published: boolean;
    country_iso: string;
    lastupdated: number;
}
