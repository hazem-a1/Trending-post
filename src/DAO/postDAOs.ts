import { MongoDbCollection } from '../interfaces/abstractDAO'; // Assuming MongoDbCollection is in the same directory
import { TrendBlogPost } from '../common/GoogleTrend.interface';
import { dbCollections } from '../constant/db-collections';

export class TrendBlogPostDAO extends MongoDbCollection<TrendBlogPost> {
  constructor() {
    super(dbCollections.posts);
    // Create a text index on title and content fields
    this.collection.createIndex({ title: "text", blogPost: "text"  }, { background: true }).then((res) => {
      console.log(`Text index created ${res}`);
    }).catch((error) => {
      console.log('Error creating text index', error);
    });
  }
}

 