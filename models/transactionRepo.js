var mustache = require('mustache'),
    q = require('q'),
    db = require('../fn/db');

exports.getAllTrans = function(limit, page) {
    var d = q.defer();

    var str_limit = '';
    if (limit > 0) {
        str_limit = 'LIMIT ' + (page - 1)*limit + ', '+ limit;
    }
    const entity = {
        str_limit: str_limit
    };
    var sql = mustache.render(
        'select * from transaction order by date desc {{str_limit}}', entity);
    console.log(sql);
    db.load(sql).then(function(rows) {
        console.log(rows);
        d.resolve(rows);

    });

    return d.promise;
};

exports.getRecentTrans = function(id, limit, page) {
    var d = q.defer();

    var str_limit = '';
    if (limit > 0) {
        str_limit = 'LIMIT ' + (page - 1)*limit + ', '+ limit;
    }
    const entity = {
        id: id,
        str_limit: str_limit
    };
    var sql = mustache.render(
        'select * from transaction where wallet_send = "{{id}}" or wallet_receive = "{{id}}"' +
        'order by date desc {{str_limit}}', entity);
    console.log(sql);
    db.load(sql).then(function(rows) {
        console.log(rows);
        d.resolve(rows);

    });

    return d.promise;
};


exports.createTransaction = function(entity) {

    var sql = mustache.render(
        'insert into transaction(coin, wallet_send, wallet_receive, date) ' +
        'values ("{{coin}}","{{wallet_send}}", "{{wallet_receive}}", "{{date}}")', entity);
    console.log(sql);
    return db.insert(sql);
};

exports.getBalance = function(id) {
    var d = q.defer();

    const entity = {
        id: id
    }
    var sql = mustache.render('select balance from wallet where id = "{{id}}"',entity);

    db.load(sql).then(function(rows) {
        console.log(rows);
        return d.resolve(rows[0]);
    });

    return d.promise;
};

exports.updateWallet = function(entity) {

    var sql = mustache.render(
        'update wallet set balance = "{{balance}}" where id = "{{id}}"',
        entity
    );

    return db.update(sql);
};

exports.insert = function(entity) {
    var sql = mustache.render(
        'insert into thongtin(hoten) values("{{hoten}}")',
        entity
    );

    return db.insert(sql);
};

exports.update = function(entity) {
    var sql = mustache.render(
        'update thongtin set hoten = "{{hoten}}" where mssv = {{mssv}}',
        entity
    );

    return db.update(sql);
};

exports.delete = function(entity) {
    var sql = mustache.render(
        'delete from thongtin where mssv = {{mssv}}',
        entity
    );
    return db.delete(sql);
};