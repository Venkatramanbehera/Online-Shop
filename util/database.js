const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:dbUser@cluster0.ikle8.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

let _db;

const mongoConnect=(callback) => {
    client.connect()
    .then( result => {
        console.log('Connected Sucessfully');
        _db = result.db();
        callback();
    })
    .catch( err => {
        console.log(err);
        throw err;
    });
}

const getDb = () => {
    if(_db){
        return _db;
    }
    throw 'No database found'; 
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;