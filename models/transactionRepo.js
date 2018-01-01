var q = require('q'),
    sync = require('../fn/syncBlockchain'),
    db = require('../fn/db_mongodb');

exports.getAllTrans = function(address) {
    d = q.defer();

    address = "ADD "+ address;
    var listOutput = [];
    var ListBlocks = sync.getAllBlocks();
    //Search in all Blocks in memory
    console.log(ListBlocks.length);
    ListBlocks.forEach(function(block){
        block.transactions.forEach(function(transaction) {
            for (i=0; i< transaction.outputs.length; i++) {
                if (transaction.outputs[i].lockScript === address){
                    // save index output and hash of transaction
                    listOutput.push({
                        transaction_hash: transaction.hash,
                        index: i,
                        value: transaction.outputs[i].value,
                        in_use: false
                    });
                }
            }

        });
    });
    // check in all inputs,
    listOutput.forEach(function(output) {
        ListBlocks.forEach(function(block) {
            block.transactions.forEach(function(transaction) {
                transaction.inputs.forEach( function (input) {
                    if (input.referencedOutputHash === output.transaction_hash && input.referencedOutputIndex === output.index) {
                        output.in_use = true;
                    }
                });
            });
        });
    });

    d.resolve(listOutput);

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