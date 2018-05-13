import * as mongodb from 'mongodb';

class DatabaseHandler {
  constructor() {
    this.server = new mongodb.Server('localhost', 27017);
    mongodb.MongoClient.connect(this.server, (err, client) => {
      if (err) throw err;
      this.init(client);
    });
  }

  init(client) {
    this.client = client;
    this.db = client.db('rgb');
    this.db.listCollections().toArray().then((items) => {
      this.setCollections(items);
    });
  }

  setCollections() {
    
  }

  idle() {
    this.ready = true;
  }

  close() {
    this.client.close();
  }
}

export { DatabaseHandler };
