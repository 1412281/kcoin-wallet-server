var mustache = require('mustache'),
    q = require('q'),
    db = require('../fn/db');

exports.loadAll = function() {

    var deferred = q.defer();
    var sql = 'select * from thongtin';
    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });
    return deferred.promise;
}

exports.loadDetail = function(id) {
    var d = q.defer();
    var entity = {
        mssv: id
    };
    var sql = mustache.render(
        'select * from thongtin where mssv = {{mssv}}', entity);

    db.load(sql).then(function(rows) {
        d.resolve(rows[0]);
    });

    return d.promise;
}

exports.insert = function(entity) {
    var sql = mustache.render(
        'insert into thongtin(hoten) values("{{hoten}}")',
        entity
    );

    return db.insert(sql);
}

exports.update = function(entity) {
    var sql = mustache.render(
        'update thongtin set hoten = "{{hoten}}" where mssv = {{mssv}}',
        entity
    );

    return db.update(sql);
}

exports.delete = function(entity) {
    var sql = mustache.render(
        'delete from thongtin where mssv = {{mssv}}',
        entity
    );
    return db.delete(sql);
}