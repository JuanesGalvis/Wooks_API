const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@wooks.swarj.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

class MongoDB {
    constructor() {
        this.client = new MongoClient(uri, {
             useNewUrlParser: true, useUnifiedTopology: true 
        });

        this.dbname = process.env.MONGO_DB;
    }

    connect() {
        if (!this.connection) {
            this.connection = new Promise(
                (resolve, reject) => {
                    this.client.connect((err) => {
                        if (err) {
                            reject(err);
                        }

                        console.log("BASE DE DATOS CONECTADA");

                        resolve(this.client.db(this.dbname));
                    })
                }
            )
        }

        return this.connection;
    }

    getAll() {
        return this.connect().then((db) => {
            return db.collection('books').find().toArray();
        })
    }
};

module.exports = MongoDB;