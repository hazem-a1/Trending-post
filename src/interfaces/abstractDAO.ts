import { Collection, Filter, OptionalUnlessRequiredId, BSON } from 'mongodb';
import { ClientProvider } from '../db/ClientProvider';
import { DB_NAME } from '../constant/db-name';

export abstract class MongoDbCollection<T extends BSON.Document> {
  protected collection: Collection<T>;

  constructor(protected collectionName: string) {
    const client = ClientProvider.getClient();

    this.collection = client.db(DB_NAME).collection<T>(collectionName);
  }
 
  async create(document: OptionalUnlessRequiredId<T>) {
    const result = await this.collection.insertOne(document);
    return result;
  }

  read(filter: Filter<T> = {}) {
    return this.collection.find(filter).toArray();
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
}