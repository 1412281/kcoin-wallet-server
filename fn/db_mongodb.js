var mongo = require('mongodb').MongoClient,
    q = require('q'),
    assert = require('assert');

var url = 'mongodb://kcoin:kT3XUg8L28MLFTMH@cluster0-shard-00-00-i2mpg.mongodb.net:27017,cluster0-shard-00-01-i2mpg.mongodb.net:27017,cluster0-shard-00-02-i2mpg.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

exports.load = function(data) {

    var d = q.defer();

    mongo.connect(url, function (err, db) {
        var cursor = db.db('wallet-db').collection('blockchain1').find();
        cursor.toArray(function (mongoError, result) {
            assert.equal(null, mongoError);
            d.resolve(result);
        });

    })

    return d.promise;
}

exports.insert = function(data) {

    var d = q.defer();
    const block = {
        "hash": "0008a302796c3542f22e5a260eb83d3fa0f609bc7f9d82cc12de72168321d2fd",
        "nonce": 7129,
        "version": 1,
        "timestamp": 1514146328,
        "difficulty": 3,
        "transactions": [{
            "hash": "1eb37415d65be50212a3c5b411f182080aeafce7c5327126eb5a551eb3c5988e",
            "inputs": [{
                "unlockScript": "DATETIME Sun Dec 24 2017 20:12:08 GMT+0000 (UTC)",
                "referencedOutputHash": "0000000000000000000000000000000000000000000000000000000000000000",
                "referencedOutputIndex": -1
            }],
            "outputs": [{
                "value": 281190,
                "lockScript": "ADD aa5f720c8080d81b9bd9781bf85c38c4d24cc010d0536e667f169ac8a5eb72d0"
            }],
            "version": 1
        }, {
            "hash": "6d97526dc919784ffabefd21adfffe56ab2384e43e41b085a54f5fd39ee6654c",
            "inputs": [{
                "unlockScript": "PUB 2d2d2d2d2d424547494e205055424c4943204b45592d2d2d2d2d0a4d4947664d413047435371475349623344514542415155414134474e4144434269514b426751437765745a4c6f4b5a4256435455766f5a2b5a743847324d656c0a4c50556b36304f637563556a61316173624f546f313461616435714d516e70544d434b71392b44355349775878666b356e4973505030457457433461335742760a74737177666b48454576736e7372774c683863454f5a623041375671453962685855534342464464467442487a466b6177734f326f53357167555463504341370a2b5977446563374a39725576326d786231514944415141420a2d2d2d2d2d454e44205055424c4943204b45592d2d2d2d2d0a SIG 39be393bebc5ec54ba48d125aea4957bb5efbf958b4c687d88e9e9c58390df8921bd31416da66043253cefb5b27cbd22c7cdc0a6743f8b0b189e4b4467fe1f23a1ca2f23a023a1610678b3887df88355f7beb6fff74ccc78851e28f7b3686eefbfae6c9c6e9fa54ffd276dde3a7bdfb5b2d844a8d01cf3e5cd4d183c829678ba",
                "referencedOutputHash": "2a68277346418c850a2fcbcfc059d486222689fab237f1b20fe20c8b41a84d9b",
                "referencedOutputIndex": 0
            }, {
                "unlockScript": "PUB 2d2d2d2d2d424547494e205055424c4943204b45592d2d2d2d2d0a4d4947664d413047435371475349623344514542415155414134474e4144434269514b426751437765745a4c6f4b5a4256435455766f5a2b5a743847324d656c0a4c50556b36304f637563556a61316173624f546f313461616435714d516e70544d434b71392b44355349775878666b356e4973505030457457433461335742760a74737177666b48454576736e7372774c683863454f5a623041375671453962685855534342464464467442487a466b6177734f326f53357167555463504341370a2b5977446563374a39725576326d786231514944415141420a2d2d2d2d2d454e44205055424c4943204b45592d2d2d2d2d0a SIG 39be393bebc5ec54ba48d125aea4957bb5efbf958b4c687d88e9e9c58390df8921bd31416da66043253cefb5b27cbd22c7cdc0a6743f8b0b189e4b4467fe1f23a1ca2f23a023a1610678b3887df88355f7beb6fff74ccc78851e28f7b3686eefbfae6c9c6e9fa54ffd276dde3a7bdfb5b2d844a8d01cf3e5cd4d183c829678ba",
                "referencedOutputHash": "4225e689306c6f2f7681b71e33d9c3f27ef30d51ab87949fb91220783f97d4d4",
                "referencedOutputIndex": 0
            }],
            "outputs": [{
                "value": 152380,
                "lockScript": "ADD aa5f720c8080d81b9bd9781bf85c38c4d24cc010d0536e667f169ac8a5eb72d0"
            }, {
                "value": 10000,
                "lockScript": "ADD 14c68e95b1238c97bdf3d777611e296c3246765ba95533fdde5a40e275f627f2"
            }, {
                "value": 10000,
                "lockScript": "ADD 4fdc4f41b64ac6d1b635166727b0cd04e780f9a1649157a1df5a6f190ed4d4d4"
            }, {
                "value": 10000,
                "lockScript": "ADD 070bb49a9764a3ff3be4e01871ecf12ed46b19fa92d3f41a6d74e1248f56f501"
            }, {
                "value": 10000,
                "lockScript": "ADD ba5e534d842c729e140fedf56cdae4e87827e9133017863484b763445b38c097"
            }, {
                "value": 10000,
                "lockScript": "ADD da0214e8d3317edfc1aa6df914d4c14bfd17cc55a10f74ea4b17124006991335"
            }, {
                "value": 10000,
                "lockScript": "ADD 3d428d21b230e943aefc6161c90b74e0a970c83750ef4b7507cae068232bb41a"
            }, {
                "value": 10000,
                "lockScript": "ADD 6daeb7a3afb7ecf77bae48639c93b60e82c1ebf022754d0590b20aeae5c47021"
            }, {
                "value": 10000,
                "lockScript": "ADD 8d2179187406133977cea9371dab04416670c489010acb5e24050320ea8d9d22"
            }, {
                "value": 10000,
                "lockScript": "ADD 78b29ab88ed83dd12f0b5bd4a31710526c80fd2bf1ff1c2df67bcfd5cba06ffb"
            }, {
                "value": 10000,
                "lockScript": "ADD f61644fccfe4f308a67d3c80a134d8bb0350d7b08b5631c00c34e08f9be16504"
            }, {
                "value": 10000,
                "lockScript": "ADD 0b92dbf5832495ffd1ace88ad1035b893a9278a5c465e7be293a2803f3c31c33"
            }, {
                "value": 10000,
                "lockScript": "ADD 79ee73acbcbfe16c4e521903f7541c4f65c15a63c4f16127d28c08d3a8ec25b4"
            }, {
                "value": 10000,
                "lockScript": "ADD e3d153912fc8393136865a8ee94d0a64671783cb29ec86ae2d08fee17df3ff95"
            }, {
                "value": 10000,
                "lockScript": "ADD 2c59f3fc24acd3372ae87dafb91200894331a62ae82fb4e86c95b1a20c699503"
            }, {
                "value": 10000,
                "lockScript": "ADD a74c89375469ce553872a753ef6e330985eec6f1ada41a9be69c246db1ad08de"
            }, {
                "value": 10000,
                "lockScript": "ADD f9284e6961e91cab1e6e822a0391f9610d2bd0d342d6922590d1e363841a6435"
            }, {
                "value": 10000,
                "lockScript": "ADD 80366954b4280405ef3ce9dbeece7d3857218b99b617f620e5cfbead413486da"
            }, {
                "value": 10000,
                "lockScript": "ADD 912be81b5c7cbdb51fc2f7ef8c0a5912da6435b85f7ef546ab9ec6036b6962fd"
            }, {
                "value": 10000,
                "lockScript": "ADD 4ddad357ef76d0600afb89f6025f64b5a0d29554f97cd87ad18849ce1cbb987a"
            }, {
                "value": 10000,
                "lockScript": "ADD 18d1482089f2d713e63a816868a9930a1d1091f9a89a6217f8b093fad94c40bd"
            }, {
                "value": 10000,
                "lockScript": "ADD 482a414af8f84c180ef42f433ba3dd488d5caa5df2c889f4c37935fc520ad782"
            }, {
                "value": 10000,
                "lockScript": "ADD 0a9a79e317e991abb94c2099f0e0e9a2b9c1f0505c3f7b9794b01c8c18af4f1b"
            }, {
                "value": 10000,
                "lockScript": "ADD 54218e5f6043b2ddedbf79d6eac2e044771e2208dc06dfebfebd87c39085ade6"
            }, {
                "value": 10000,
                "lockScript": "ADD 4021e05a50583354dfcd112f7860775ed52ddd77526ff20e6a6ba339be00f8f3"
            }, {
                "value": 10000,
                "lockScript": "ADD 1c680c996cb1c5fde6f30ccf6d1e82c3642c88aeb5d998c691d0ae576af84770"
            }, {
                "value": 10000,
                "lockScript": "ADD 29611b690efcc913314e9c225bfcded793789c13233de22a8f579667377681d1"
            }, {
                "value": 10000,
                "lockScript": "ADD ca0561ab3009280918ddca16c001cfce54c4b8e4858b26ffb3d2e78fa8623b06"
            }, {
                "value": 10000,
                "lockScript": "ADD b2688bb136f1a7da8a431a94af97435f5f283f77e762c57e79c649ff52686f65"
            }, {
                "value": 10000,
                "lockScript": "ADD ff897d5038bf81864673849ecd98a564a6edd19a6fc40f1451f380f25739ce9b"
            }, {
                "value": 10000,
                "lockScript": "ADD 2b4d86984fdead6d1feee0d456707f5ded9aaddbe35e07eb7e201878fe7356d1"
            }, {
                "value": 10000,
                "lockScript": "ADD 7135c7b57b9285ba457437c3c5c7d1c1237377f5238cf1e716af40dc7c7fdd30"
            }, {
                "value": 10000,
                "lockScript": "ADD a40acc4bf7f323c59d1e64be7563870e578c5b13b6c92ec0dcd779e0d98ed357"
            }, {
                "value": 10000,
                "lockScript": "ADD 3ef9e4a9fdcdf96c9a75a2c8f550c6436b916cc005e1d0769d20172bd6c90b18"
            }, {
                "value": 10000,
                "lockScript": "ADD 2172b4096646d73bd82bc3c7421c6e0e585a29de8c730a3ec2966efe5e98477a"
            }, {
                "value": 10000,
                "lockScript": "ADD 5fc0c39a7b20081a59300b3b6586637e66e3462370da963081fbf684d6378e91"
            }, {
                "value": 10000,
                "lockScript": "ADD c58cfc88a918f50f9589558f6210d470f88c509cdf09a0c5fc881f20fd09397c"
            }, {
                "value": 10000,
                "lockScript": "ADD 219c3544677f086818e9628c78baf2fb288a15c0ce86318243c68ff230b1d58b"
            }, {
                "value": 10000,
                "lockScript": "ADD 200b2067f369d903982e3b2388e28e1eccdb851632bc113845ccdcd39c33a92e"
            }, {
                "value": 10000,
                "lockScript": "ADD 45bbee48882fcc3887cea86d072b24311e8daf2d02b4f6316083654473be8ccf"
            }, {
                "value": 10000,
                "lockScript": "ADD da50c33040dafb4dc2bfb71d47ecf298cf35e88080dd20eea52b7dec831ded58"
            }, {
                "value": 10000,
                "lockScript": "ADD f88b0c461761c98e8a5fe1f2ef7e8e7ae3a87a1511bc2f2d05c3735a1378312b"
            }],
            "version": 1
        }],
        "transactionsHash": "7011476d06662d99f0958a2b99db0d43892876e7b1f08c839bd2bc90a4c764df",
        "previousBlockHash": "000b80d1045e6e6f37e8e1486df255508300fed02b672eaa411f60ec2cd08729"
    };

    mongo.connect(url, function (err, db) {
        console.log(db);
        db.db('wallet-db').collection("blockchain1").insertOne(block, function (err, result) {
            console.log('inserted');
            assert.equal(null, err);
            d.resolve(result);
            db.close();
        })
    })

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