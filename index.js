var async = require('async');
var restify = require('restify');
var r = require('rethinkdb');
var bcrypt = require('node-bcrypt');

var config = require('./config');
var routes = require('./routes');
var install = require('./install');

// Initialize the server
var server = restify.createServer();
server.pre(function (req, resp, next) {
  server.pre(restify.pre.sanitizePath());
  req._rdbConn = server._rdbConn;
  return next();
});

// OAuth2
// TODO: Implement it.

// Routes
server.get('/users', routes.getUsers);
server.get('/users/:handle', routes.getUser);
server.get('/chars', routes.getChars);
server.get('/chars/:handle', routes.getChar);

function startServer(connection)
{
  // Pass in Database connection;
  server._rdbConn = connection;

  // Start the Server
  server.listen(8083, function() {
    console.log('%s listening at %s', server.name, server.url);
  });

}

async.waterfall(install.waterfall, function(err,connection){
  if ( err ) {
    console.error(err);
    process.exit(1);
    return;
  }
  startServer(connection);
});
