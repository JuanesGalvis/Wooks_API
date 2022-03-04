const { MongoClient, ObjectId } = require('mongodb');

class MongoDB {
    constructor() {
        this.client = new MongoClient(process.env.MONGO_URI, {
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

    getAll(userId) {
        return this.connect().then((db) => {
            return db.collection('books').find({id_owner: ObjectId(userId)}).toArray();
        })
    }

    getOne(id, userId) {
        return this.connect().then((db) => {
            return db.collection('books').find({ "_id": ObjectId(id), id_owner: ObjectId(userId) }).toArray();
        })
    }

    getCantidadPaginas(id, userId) {
        return this.connect().then((db) => {
            return db.collection('books').find({ "_id": ObjectId(id), id_owner: ObjectId(userId) }).project({ "_id": 0, "paginas": 1 }).toArray();
        })
    }

    create(newBook, userId) {
        return this.connect().then((db) => {
            return db.collection('books').insertOne({...newBook, id_owner: ObjectId(userId)});
        })
    }

    delete(id, userId) {
        return this.connect().then((db) => {
            return db.collection('books').deleteOne({ "_id": ObjectId(id), id_owner: ObjectId(userId) });
        })
    }

    updateStatus(id, payload, userId) {

        return this.connect().then((db) => {
            if (payload.NewState === "Terminado") {
                return db.collection('books').updateOne({ "_id": ObjectId(id), id_owner: ObjectId(userId)},
                    {
                        "$set": { "state": payload.NewState, "review": parseInt(payload.review) },
                        "$unset": { "actual": "", "progress": "" }
                    });
            } else if (payload.NewState === "Leyendo") {
                return db.collection('books').updateOne({ "_id": ObjectId(id), id_owner: ObjectId(userId)},
                    { "$set": { "state": payload.NewState, "actual": 1, "progress": 0 } });
            } else {
                return db.collection('books').updateOne({ "_id": ObjectId(id), id_owner: ObjectId(userId)},
                    { "$set": { "state": payload.NewState } });
            }
        })
    }

    updateProgress(id, newActual, totalPages, userId) {

        if (totalPages === 0) {
            return false;
        } else {

            let newProgress = parseInt(newActual / totalPages * 100);

            return this.connect().then((db) => {
                return db.collection('books').updateOne({ "_id": ObjectId(id), id_owner: ObjectId(userId) }, {
                    "$set": {
                        "actual": newActual,
                        "progress": newProgress
                    }
                })
            })
        }
    }

    updateBook(id, changes, userId) {

        /** MIRAR: HACE FALTA REFACTORIZAR O YA FUNCIONA CORRECTAMENTE? */

        let BookChanges = {}

        changes.title ? BookChanges.title = changes.title : "";
        changes.portada ? BookChanges.portada = changes.portada : "";
        changes.paginas ? BookChanges.paginas = changes.paginas : "";
        changes.autores ? BookChanges.autores = changes.autores : "";
        changes.categories ? BookChanges.categories = changes.categories : "";

        return this.connect().then((db) => {
            return db.collection('books').updateOne({ "_id": ObjectId(id), id_owner: ObjectId(userId) }, {
                "$set": { ...BookChanges }
            })
        })
    }

    /** USUARIOS */
    insertUser(data) {
        return this.connect().then((db) => {
            return db.collection('users').insertOne(data);
        });
    }
    getUser(userEmail) {
        return this.connect().then((db) => {
            return db.collection('users').findOne({ email: userEmail });
        });
    }
    getUserFriends(userId) {
        return this.connect().then((db) => {
            return db.collection('users').aggregate([
                {
                  '$match': {
                    '_id': new ObjectId(userId)
                  }
                }, {
                  '$lookup': {
                    'from': 'users', 
                    'localField': 'friends', 
                    'foreignField': '_id', 
                    'as': 'amigos'
                  }
                }
              ])
        });
    }
    updateUser(userId, editedUser) {
        return this.connect().then((db) => {
            return db.collection('users').updateOne(
                { _id: ObjectId(userId) },
                { $set: { ...editedUser } }
            );
        });
    }
    deleteUser(userId) {
        return this.connect().then((db) => {
            return db.collection('users').deleteOne({ _id: ObjectId(userId) });
        });
    }

    /* AMIGOS */
    requestFriend(userId, FriendId) {
        return this.connect().then((db) => {
            return db.collection('users').updateOne({ _id: ObjectId(FriendId) }, { $push: { request_friends: ObjectId(userId) } })
        })
    }

    addFriend(userId, FriendId) {
        return this.connect().then((db) => {

            // Eliminar la solicitud de amistad
            db.collection('users').updateOne({ _id: ObjectId(userId) }, { $pull: { request_friends: ObjectId(userId) } })

            // Agregar como amigos a ambos
                   db.collection('users').updateOne({ _id: ObjectId(userId) }, { $push: { friends: ObjectId(FriendId) } })
            return db.collection('users').updateOne({ _id: ObjectId(FriendId) }, { $push: { friends: ObjectId(userId) } })
        })
    }
};

module.exports = MongoDB;