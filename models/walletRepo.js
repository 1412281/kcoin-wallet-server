var mustache = require('mustache'),
    q = require('q'),
    db = require('../fn/db');


exports.login = function(entity) {
    var d = q.defer();

    var sql = mustache.render(
        'select * from wallet where id = "{{id}}" and password = "{{password}}"', entity);

    db.load(sql).then(function(rows) {
        if (rows.length > 0)
            d.resolve(rows[0]);
        else {
            d.resolve({});
        }
    });

    return d.promise;
};

exports.register = function(entity) {

    var sql = mustache.render(
        'insert into wallet(id, password, email, balance) ' +
        'values ("{{id}}", "{{password}}","{{email}}", "{{balance}}")', entity);

    return db.insert(sql);
};


exports.getDashboard = function(id) {
    return q.all([getBalance((id))]);
};

exports.checkExist = function(id) {
    var d = q.defer();

    const entity = {
        id: id
    };
    var sql = mustache.render(
        'select * from wallet where id = "{{id}}"', entity);

    db.load(sql).then(function(rows) {
        if (rows.length !== 0) {
            d.resolve(true);
        }
        else {
            d.resolve(false);
        }
    });

    return d.promise;

};

exports.updateWallet = function(entity) {
    var sql = mustache.render(
        'update wallet set balance = "{{balance}}" where id = {{id}}',
        entity
    );

    return db.update(sql);
};

var getBalance = function(id) {
    var d = q.defer();

    const entity = {
        id: id
    };
    var sql = mustache.render('select balance from wallet where id = "{{id}}"',entity);

    db.load(sql).then(function(rows) {
        return d.resolve(rows[0]);
    });

    return d.promise;
};

// exports.insert = function(entity) {
//     var sql = mustache.render(
//         'insert into thongtin(hoten) values("{{hoten}}")',
//         entity
//     );
//
//     return db.insert(sql);
// }
//
// exports.update = function(entity) {
//     var sql = mustache.render(
//         'update thongtin set hoten = "{{hoten}}" where mssv = {{mssv}}',
//         entity
//     );
//
//     return db.update(sql);
// }
//
// exports.delete = function(entity) {
//     var sql = mustache.render(
//         'delete from thongtin where mssv = {{mssv}}',
//         entity
//     );
//     return db.delete(sql);
// }
//