// Routes

var restify = require('restify');
var r = require('rethinkdb');

function getAllDocuments(table, req, res, next)
{
    r.db('stories').table(table).run(req._rdbConn, function(err, cursor) {
        if ( err ) return next(err);
        cursor.toArray(function(err, results){
            if (err) return next(err);
            res.json(results);
        });
    });
}

function getDocumentByHandle(table, req, res, next)
{
    var handle = req.params.handle;
    r.db('stories').table(table)
        .getAll(handle, {index: "handle"})
        .run(req._rdbConn, function(err, cursor) {
            if (err) return next(err);
            cursor.toArray(function(err, results){
                if (err) return next(err);
                if ( results.length <= 0 ) res.send(200, false);
                res.json(results[0]);
            });
        });
}

module.exports.getUsers = function (req, res, next)
{
    getAllDocuments('users', req, res, next);
};

module.exports.getUser = function (req, res, next)
{
    getDocumentByHandle('users', req, res, next);
};

module.exports.getChars = function (req, res, next)
{
    getAllDocuments('chars', req, res, next);
};

module.exports.getChar = function (req, res, next)
{
    getDocumentByHandle('chars', req, res, next);
};
