import { Collection, Filter, OptionalUnlessRequiredId, BSON, FindOptions } from 'mongodb';
import { ClientProvider } from '../db/ClientProvider';

export abstract class MongoDbCollection<T extends BSON.Document> {
  protected collection: Collection<T>;

  constructor(protected collectionName: string) {
    const client = ClientProvider.getClient();

    this.collection = client.db().collection<T>(collectionName);
  }
 
  async create(document: OptionalUnlessRequiredId<T>) {
    const result = await this.collection.insertOne(document);
    return result;
  }

  async read(filter: Filter<T> = {}, options: FindOptions<T> = {}) {
    return this.collection.find(filter, options).toArray();
  }

  // Search for text in the collection that has a text index
  async search(text: string, filter: Filter<T> = {}, options: FindOptions<T> = {}) {
    return this.collection.find({ $text: { $search: text }, ...filter }, options).toArray();
  }

  async count(filter: Filter<T> = {}) {
    return this.collection.countDocuments(filter); 
  }

  async findOne(filter: Filter<T>) {
    return this.collection.findOne(filter);
  }

  async update(filter: Filter<T>, update: Partial<T>) {
    const result = await this.collection.updateMany(filter, { $set: update });
    return result.modifiedCount;
  }

  async delete(filter: Filter<T>) {
    return this.collection.deleteMany(filter);
  }

  async insertMany(documents: OptionalUnlessRequiredId<T>[]) {
    return this.collection.insertMany(documents);
  }

  async bulkWrite(requests: any[]) {
    return this.collection.bulkWrite(requests);
  }
}