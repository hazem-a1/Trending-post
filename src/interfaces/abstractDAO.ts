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

  read(filter: Filter<T> = {}, options: FindOptions<T> = {}) {
    return this.collection.find(filter, options).toArray();
  }

  async count(filter: Filter<T> = {}) {
    return this.collection.countDocuments(filter); 
  }

  findOne(filter: Filter<T>) {
    return this.collection.findOne(filter);
  }

  async update(filter: Filter<T>, update: Partial<T>) {
    const result = await this.collection.updateMany(filter, { $set: update });
    return result.modifiedCount;
  }

  delete(filter: Filter<T>) {
    return this.collection.deleteMany(filter);
  }

  insertMany(documents: OptionalUnlessRequiredId<T>[]) {
    return this.collection.insertMany(documents);
  }

  bulkWrite(requests: any[]) {
    return this.collection.bulkWrite(requests);
  }
}