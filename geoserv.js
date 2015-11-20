var restify = require('restify');
var geodata = require('./geodata');


function getData(req, res, next) {

  var place = req.params.id;
  var radius = parseInt(req.query.radius);
  var maxPop = parseInt(req.query.maxpop);
  var minPop = parseInt(req.query.minpop);

  var query = {
    'asciiname': place,
    'feature-code': {
      $in: ['PPL', 'PPLA', 'PPLA2', 'PPLL', 'PPLG', 'PPLC']
    }
  }

  var selector = {
    _id: 0,
    asciiname: 1,
    population: 1,
    location: 1
  }

  geodata.getCityData(query, selector, function(doc) {
    if (doc == null) {
      res.json({
        err: "Sorry " + place + " Not found"
      });
      next();
    } else {
      if (radius) {
        delete query.asciiname;
        var distance = radius / 6378.1;
        var longitude = doc.location.coordinates[0];
        var latitude = doc.location.coordinates[1];
        console.log(longitude, latitude);
        query.location = {
          $geoWithin: {
            $centerSphere: [
              [longitude, latitude],
              distance
            ]
          }
        }

        if (maxPop && minPop) {
          query.population = {
            $lte: maxPop, $gte: minPop
          }
        }

        else if (maxPop) {
          query.population = {
            $lte: maxPop
          }
        }

        else if (minPop) {
          query.population = {
            $gte: minPop
          }
        }

        console.log(query);

        geodata.getCitiesData(query, selector, function(docarray) {
          if (docarray == null) {
            res.json({
              err: "Sorry near " + place + " Nothing found"
            });
            next();
          } else {
            res.json(docarray);
            next();
          }

        })


      } else {
        res.json(doc);
        next();
      }
    }
  });
}


var server = restify.createServer();

server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.queryParser());

server.get('/api/cities/:id', getData);


server.listen(process.env.PORT || 8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
