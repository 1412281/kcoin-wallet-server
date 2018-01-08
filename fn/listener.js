const q = require('q');
const db = require('./db_firebase');
const transactionRepo = require('../models/transactionRepo');
const utils = require('./utils');
const transfer = require('./transfer');

const COIN_MIN = 1000;
// exports.initListener = function () {
//     setInterval(function () {
//         createOutput();
//     }, 3000);
// }

//auto create out put
//listener transaction is waiting


exports.createOutput = function () {
    console.log('=======AUTO CREATE OUTPUTS==========');
    var d = q.defer();
    var d_outputOnSystem = q.defer();
    var d_listOutputWillUse = q.defer();
    var d_getKeysOfOutputs = q.defer();
    var d_createUsers = q.defer();
    var d_sumOfValue = q.defer();
    const q1 = require('q');
    db.load('output', {}).then(function (outputs) {
        d_outputOnSystem.resolve(outputs);
    });


    d_outputOnSystem.promise.then(function (outputs) {
        // console.log('output length', outputs);
        if (outputs.length < 30) {
            var sum = 0;
            var referenceOutputs = [];
            outputs.forEach(function (output) {
                if (output.value > COIN_MIN) {
                    referenceOutputs.push({
                        hash: output.transaction_hash,
                        value: output.value,
                        index: output.index,
                        address: output.address
                    });
                    sum += output.value;
                }
            });
            d_listOutputWillUse.resolve(referenceOutputs);
            d_sumOfValue.resolve(sum);
        }
    });
    d_listOutputWillUse.promise.then(function (outputs) {
        // console.log(outputs);
        transactionRepo.getKeysOfOutputs(outputs).then(function (keys) {
            // console.log('keys', keys);
            d_getKeysOfOutputs.resolve(keys);
        });
    });

    d_sumOfValue.promise.then(function (sum) {
        console.log(sum);
        var maxUsers = sum / COIN_MIN;
        var users = [];
        for (var i = 0; i < maxUsers - 1; i++) {
            users.push(createAnonymousUser());
        }
        d_createUsers.resolve(q1.all(users));
    });

    q.all([d_listOutputWillUse.promise, d_getKeysOfOutputs.promise, d_createUsers.promise]).then(function (data) {
        console.log(data);
        var referencOutputs = [];
        data[0].forEach(function (output) {
            referencOutputs.push({
                hash: output.hash,
                value: output.value,
                index: output.index
            });
        });
        var keys = [];
        data[1].forEach(function (key) {
            keys.push({
                privateKey: key.privateKey,
                publicKey: key.publicKey,
                address: key.address
            })
        });
        var destinations = [];
        data[2].forEach(function (des) {
            destinations.push({
                address: des,
                value: COIN_MIN
            })
        })
        transfer.createTransfer(referencOutputs, keys, destinations).then(function (result) {
            d.resolve(result);
        });

    })

    return d.promise;

};

var createAnonymousUser = function () {
    var d = q.defer();
    var user = utils.generateAddress();
    db.insert('user', '', user).then(function (result) {
        d.resolve(user);
    });
    d.resolve(user.address);
    return d.promise;
};

