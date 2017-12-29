var mustache = require('mustache'),
    q = require('q'),
    db = require('../fn/db');



exports.register = function(entity) {

    var sql = mustache.render(
        'insert into user(email) ' +
        'values ("{{email}}")', entity);

    return db.insert(sql);
}
