import * as mongodb from 'mongodb';

class DatabaseHandler {
  constructor() {
    this.server = new mongodb.Server('localhost', 27017);
    this.dbname = 'rgb';

    mongodb.MongoClient.connect(this.server, (err, client) => {
      console.log('Connected');
      client.close();
    });
  }
}

export { DatabaseHandler };
