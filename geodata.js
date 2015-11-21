var MongoClient = require('mongodb').MongoClient;

// Read from connection string from env if it is set or else default
var connectStringMongoDB = process.env.MONGOURL || 'mongodb://localhost:27017/NL';

// Returns exactly one object that matches the query
exports.getCityData = function(query, selector, callback) {
  MongoClient.connect(connectStringMongoDB, function(err, db) {
    if (err) throw err;
    db.collection('features').findOne(query, selector, function(err, doc) {
      if (err) {
        db.close();
        throw err;
      }
      db.close();
      callback(doc);
    });
  });
}

// Return an array of object that match the criteria in the query
exports.getCitiesData = function(query, selector, callback) {
  MongoClient.connect(connectStringMongoDB, function(err, db) {
    if (err) throw err;
    db.collection('features').find(query, selector).toArray(function(err, docs) {
      if (err) {
        db.close();
        throw err;
      }
      db.close();
      callback(docs);
    });
  });
}
