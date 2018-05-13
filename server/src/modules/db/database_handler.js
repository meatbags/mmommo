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
    this.dbname = 'rgb';
    this.db = client.db(this.dbname);
    const c = this.db.collection('sup');
    console.log(c);
  }
}

export { DatabaseHandler };
