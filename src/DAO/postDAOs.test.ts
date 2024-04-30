import { TrendBlogPostDAO } from "./postDAOs";

describe('TrendBlogPostDAO', () => {
  let trendBlogPostDAO: TrendBlogPostDAO;

  beforeEach(() => {
    trendBlogPostDAO = new TrendBlogPostDAO();
  });

  test('should create an instance of TrendBlogPostDAO', () => {
    expect(trendBlogPostDAO).toBeInstanceOf(TrendBlogPostDAO);
  });

 
  // Add more tests for the methods and functionality of TrendBlogPostDAO
});