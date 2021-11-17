const { MongoClient, ObjectId } = require('mongodb');

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

                        resolve(this.client.db(this.dbname).collection('books'));
                    })
                }
            )
        }

        return this.connection;
    }

    getAll() {
        return this.connect().then((db) => {
            return db.find().toArray();
        })
    }

    getOne(id) {
        return this.connect().then((db) => {
            return db.find({"_id": ObjectId(id)}).toArray();
        })
    }

    getCantidadPaginas (id) {
        return this.connect().then((db) => {
            return db.find({"_id": ObjectId(id)}).project({"_id": 0, "paginas": 1}).toArray();
        })
    }

    create(newBook) {
        return this.connect().then((db) => {
            return db.insertOne(newBook);
        })
    }

    updateStatus(id, payload) {
        
        return this.connect().then((db) => {
            if (payload.NewState === "Terminado") {
                return db.updateOne({"_id": ObjectId(id)}, 
                    {"$set": {"state": payload.NewState, "review": parseInt(payload.review)},
                    "$unset": {"actual": "", "progress": ""}});
            } else if (payload.NewState === "Leyendo") {
                return db.updateOne({"_id": ObjectId(id)}, 
                    {"$set": {"state": payload.NewState, "actual": 1, "progress": 0}});
            }
        })
    }

    updateProgress(id, newActual, totalPages){
        
        if (totalPages === 0) {
            return false;
        } else {

            let newProgress = parseInt(newActual/totalPages*100);

            return this.connect().then((db) => {
                return db.updateOne({"_id": ObjectId(id)}, {
                    "$set": {
                        "actual": newActual,
                        "progress": newProgress
                    }
                })
            })
        }
    }

    delete(id) {
        return this.connect().then((db) => {
            return db.deleteOne({"_id": ObjectId(id)});
        })
    }
};

module.exports = MongoDB;