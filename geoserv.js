var restify = require('restify');
var geocontroller = require('./geocontroller');

var server = restify.createServer();

server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.queryParser());

// API endpoints
server.get('/api/cities/:id', geocontroller.getData);

server.listen(process.env.PORT || 8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
