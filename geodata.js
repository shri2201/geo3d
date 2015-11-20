var MongoClient = require('mongodb').MongoClient;

exports.getCityData = function(query, selector, callback) {
  MongoClient.connect('mongodb://localhost:27017/NL', function(err, db) {
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

exports.getCitiesData = function(query, selector, callback) {
  MongoClient.connect('mongodb://localhost:27017/NL', function(err, db) {
    if (err) throw err;
    db.collection('features').find(query, selector).toArray(function(err, docs) {
      if (err) {
        db.close();
        throw err;
      }
      db.close();
      console.log(docs);
      callback(docs);
    });
  });
}
