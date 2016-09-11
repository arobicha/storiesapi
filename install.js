var r = require('rethinkdb');
var config = require('./config');


var connect = function (callback) {
  r.connect(config.rethinkdb, callback);
};

var createDb = function (connection, callback) {
  console.log("Initializing DB: stories");
  r.dbList().contains(config.rethinkdb.db).do(function (containsDb) {
    return r.branch(
      containsDb,
      {created: 0},
      r.dbCreate(config.rethinkdb.db)
    );
  }).run(connection, function(err) { callback(err, connection); });
};

var createTable = function (table, connection, callback) {
  console.log("Initializing table: " + table);
  r.tableList().contains(table).do(function (containsTable) {
    return r.branch(
      containsTable,
      {created: 0},
      r.tableCreate(table)
    );
  }).run(connection, function(err) { callback(err, connection); });
};

var createUsersTable = function ( connection, callback ) {
  createTable('users', connection, callback);
};

var createCharsTable = function ( connection, callback ) {
  createTable('chars', connection, callback);
};

var createGamesTable = function ( connection, callback ) {
  createTable('games', connection, callback);
};

function createKey(table, key) {
  r.table(table).indexList().contains(key).do(function(hasIndex) {
    return r.branch(
      hasIndex,
      {created: 0},
      r.table(table).indexCreate(key)
    );
  }).run(connection, function(err) { callback(err, connection); });
}

function waitForKey(table, key) {
  r.table(table).indexWait(key).run(connection, function (err, result) {
    callback(err, connection);
  });
}

module.exports.waterfall = [
  connect
];
