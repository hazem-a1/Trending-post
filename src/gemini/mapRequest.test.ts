import { mapRequestToTrend } from "./mapRequestToTrend";

describe('mapRequestToTrend', () => {
  test.only('should map request data to trends', () => {
    const data = {
      default: {
        trendingSearchesDays: [
          {
            trendingSearches: [
              {
                title: {
                  query: 'Test Trend',
                },
                formattedTraffic: '1000',
                image: {
                  imageUrl: 'https://example.com/image.jpg',
                },
                articles: [
                  {
                    title: 'Test Article',
                    source: 'Test Source',
                    url: 'https://example.com/article',
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    const expected = [
      {
        title: 'Test Trend',
        traffic: '1000',
        image: 'https://example.com/image.jpg',
        date: expect.any(String),
        articles: [
          {
            title: 'Test Article',
            source: 'Test Source',
            url: 'https://example.com/article',
          },
        ],
      },
    ];

    const result = mapRequestToTrend(data);

    expect(result).toEqual(expected);
  });
});