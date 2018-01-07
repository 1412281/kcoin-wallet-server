var axios = require('axios');
var transactions = require('./transactions');
var transactionRepo = require('../models/transactionRepo');
var db = require('./db_firebase');
var q = require('q');

exports.getAllOutputCanUseInSystem = function () {
    return db.load('output', {});
}


exports.getAllOutputCanUseInBlockchain = function () {

    // console.log('-----------tranfer');

    var d1 = q.defer();

        db.load('user', {}).then(function (users) {

            var promises = [];

            const listAddress = users.map(function (user) {
                return user.address;
            });
            // console.log(listAddress);

            listAddress.forEach(function (address) {

                var d2 = q.defer();
                transactionRepo.getAllTrans(address).then(function (trans) {
                    var list = [];
                    trans.forEach(function (tran) {
                        if (!tran.in_use) {
                            list.push(tran);
                            // console.log(tran);
                        }
                    });
                    d2.resolve(list);
                });
                promises.push(d2.promise);

            })

            d1.resolve(promises);
        });

    return q.all(d1.promise).then(function (listList) {
        var outputs = [];
        listList.forEach(function (list) {
            list.forEach(function (output) {
                outputs.push(output);
            })
        });
        return outputs;
    });

}

exports.createTransfer = function (referenceOutputs, keys, destinations) {

    console.log('create transfer')
    // var referenceOutputs = [
    //     {hash: 'd842dfe1270aa63fddd214ce2ffd630f320c79dde6df3c34991dfabfaef363c8', index: 1, value: 1}
    // ];

    var addressReceiveChange = "da0214e8d3317edfc1aa6df914d4c14bfd17cc55a10f74ea4b17124006991335";
// Read key (address, public key, private key)
//     var key = {"privateKey":"2d2d2d2d2d424547494e205253412050524956415445204b45592d2d2d2d2d0a4d4949435851494241414b426751446962326e692f7a79637263395659576977464851396474723352413758316f664b6e624d334b756e6559317a394471586e0a7272563239482f786f7352644855315a6d30683573536e2f7a6c6876444b534a693730444b542b7532576b737151514f584a4e4c3859486f346c386a615833570a5a6f37315336753256465273716f6b6c5a306e686f356b4c4d58674a4c355578554637664733536c57586a6c70347733417352494a4a664558514944415141420a416f4741626a4d597a6b2b336d4f3043426153466859512b32686235452f4f38595a44587632556d626b666c54385439345735366b5a6d325750452f50304d650a3238354238635566375a477152674f50694751587735554e5a41305931506961315165767348627266417552737053795865575151786e366a6a645331424e6e0a307844303567506e736647694d566c2f39544a7a6d4b7036483238474e5236683847484a31365a6e6d4f4542716f4543515144796d716d76344a694246652f490a4b476c356842636a714647434e457966522b733349443657534a45546e364856505a453437484a70646b6172706a346e73774c7032496330706f72586b4652720a6c6f324b68686339416b454137764178764b79442f4a3141766a5036444c61714a6478724a7038756b4c46785a573852506f4931324f2f6c4a664f6b637959660a717052786a4f6954633861454c51467532364d596466326e7961465565456f7a6f514a41485974434d4e3373464952455942367a7759325a64386b75712b6d4d0a6a7a556c36742b74583458557a5176366e45705548686546553179492f4b7852453271555a7a2f734c7a6738336b5741556c3353504e565a6a514a4241495a670a2b2f6636706a68615547456f5a6b626b4c496b696a2f696d71632b696d2f334b4730366d654a5a4c525071314c6857387153364d5564684872545839766252360a43396a6d76776b4d34574b616f79454c796b45435151445a6f6978314e32552f72514774474e44706c35774e625767546d6f333861615541627a74645845767a0a452b5a3577727a2f4c58696a694249744c6666677044466b59397761706a414d6a534e4f7973626c704c396e0a2d2d2d2d2d454e44205253412050524956415445204b45592d2d2d2d2d0a","publicKey":"2d2d2d2d2d424547494e205055424c4943204b45592d2d2d2d2d0a4d4947664d413047435371475349623344514542415155414134474e4144434269514b426751446962326e692f7a7963726339565957697746485139647472330a52413758316f664b6e624d334b756e6559317a394471586e7272563239482f786f7352644855315a6d30683573536e2f7a6c6876444b534a693730444b542b750a32576b737151514f584a4e4c3859486f346c386a615833575a6f37315336753256465273716f6b6c5a306e686f356b4c4d58674a4c355578554637664733536c0a57586a6c70347733417352494a4a664558514944415141420a2d2d2d2d2d454e44205055424c4943204b45592d2d2d2d2d0a","address":"4edbd2d5a816a52f76a22e554ee0407e969f7c7374e6b3876d1a7aa06609b161"};
//
// // Read destination address
//     var destinations = [
//         {address: 'da0214e8d3317edfc1aa6df914d4c14bfd17cc55a10f74ea4b17124006991335', value: 1}
//     ];


    var cost = 0;
    destinations.forEach(function (des) {
        cost += des.value;
    });

    var fund = 0;
    referenceOutputs.forEach(function (referenceOutput) {
        fund += referenceOutput.value;
    });

    var change = fund - cost;

// Generate transacitons
    var bountyTransaction = {
        version: 1,
        inputs: [],
        outputs: []
    };

    referenceOutputs.forEach(function (referenceOutput) {
        bountyTransaction.inputs.push({
            referencedOutputHash: referenceOutput.hash,
            referencedOutputIndex: referenceOutput.index,
            unlockScript: ''
        });
    });

// Change because reference output must be use all value
    if (change > 0) {
        bountyTransaction.outputs.push({
            value: change,
            lockScript: 'ADD ' + addressReceiveChange
        });
    }

// Output to all destination 10000 each
    destinations.forEach(function (des) {
        bountyTransaction.outputs.push({
            value: des.value,
            lockScript: 'ADD ' + des.address
        });
    });


    transactions.sign(bountyTransaction, keys);

    console.log(JSON.stringify(bountyTransaction));


    return axios.post('https://api.kcoin.club/transactions', bountyTransaction);


// => Hash: 6d97526dc919784ffabefd21adfffe56ab2384e43e41b085a54f5fd39ee6654c
};
