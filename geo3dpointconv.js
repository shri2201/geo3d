var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/NL', function(err, db) {
  if (err) throw err;
  var query = {};
  var cursor = db.collection('features').find(query);

  cursor.each(function(err, doc) {
    if (err) throw err;

    if (doc == null) {
      console.log('Null doc');
      return;
    }

    if (cursor.isClosed()) {
      console.log('all items have been processed');
      db.close();
      exit;
    }

    var queryId = {
      '_id': doc._id
    };

    db.collection('features').findOne(queryId, function(err, doc) {
      if (err) throw err;
      if (!doc) {
        console.log('No documents for assignment ' + query.name + ' found!');
        return;
      }

      doc.location = {
        "type": "Point",
        "coordinates": [doc.longitude, doc.latitude]
      }

      db.collection('features').update(queryId, doc, function(err, updated) {
        if (err) throw err;
        console.dir("Successfully updated " + doc.name + " document!");
      });
    });
  });
});
