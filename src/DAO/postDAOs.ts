import { MongoDbCollection } from '../interfaces/abstractDAO'; // Assuming MongoDbCollection is in the same directory
import { TrendBlogPost } from '../common/GoogleTrend.interface';
import { dbCollections } from '../constant/db-collections';

export class TrendBlogPostDAO extends MongoDbCollection<TrendBlogPost> {
  constructor() {
    super(dbCollections.posts); 
  }
}

 