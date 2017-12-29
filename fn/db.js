var mysql = require('mysql'),
    q = require('q');

var _HOST = '127.0.0.1',
    _USER = 'root',
    _PWD = '123456',
    _DB = 'myblockchain';

exports.load = function(sql) {

    var d = q.defer();

    var connection = mysql.createConnection({
        host: _HOST,
        user: _USER,
        password: _PWD,
        database: _DB,
        multipleStatements: true
    });

    connection.connect();

    connection.query(sql, function(error, rows, fields) {
        if (error)
            d.reject(error);
        // throw error;

        d.resolve(rows);
    });

    connection.end();

    return d.promise;
}

exports.insert = function(sql) {

    var d = q.defer();
    var id;
    var connection = mysql.createConnection({
        host: _HOST,
        user: _USER,
        password: _PWD,
        database: _DB
    });

    connection.connect();

    connection.query(sql, function(error, value) {
        if (error) {
            // throw error;
            d.reject(error);
        } else {
            d.resolve(value.insertId);
            console.log(value.insertId);
            id = value.insertId;
        }
    });

    connection.end();
    return d.promise;
}

exports.update = function(sql) {

    var d = q.defer();

    var connection = mysql.createConnection({
        host: _HOST,
        user: _USER,
        password: _PWD,
        database: _DB
    });

    connection.connect();

    connection.query(sql, function(error, value) {
        if (error) {
            d.reject(error);
        } else {
            d.resolve(value.changedRows);
        }
    });

    connection.end();

    return d.promise;
}

exports.delete = function(sql) {

    var d = q.defer();

    var connection = mysql.createConnection({
        host: _HOST,
        user: _USER,
        password: _PWD,
        database: _DB
    });

    connection.connect();

    connection.query(sql, function(error, value) {
        if (error) {
            d.reject(error);
        } else {
            d.resolve(value.affectedRows);
        }
    });

    connection.end();

    return d.promise;
}