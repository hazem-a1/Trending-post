import { MongoClient } from 'mongodb';



export class ClientProvider {
  private static client: MongoClient;
  private constructor() { }

  static getClient() {
    if (!this.client) {
      this.client = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017',
        {
          maxPoolSize: 50,
          writeConcern: { w: 'majority', wtimeout: 2500 },
        });
      this.client.connect().then((cl) => {
        this.client = cl;
        console.log('Connected to MongoDB');
      }).catch((err) => { console.error(err); });
    }
    return this.client;
  }
}
