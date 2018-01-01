const utils = require('./utils')

const _ = require('lodash');


// Convert a transaction to binary format for hashing or checking the size
var toBinary = function (transaction, withoutUnlockScript) {
    var version = Buffer.alloc(4);
    version.writeUInt32BE(transaction.version);
    var inputCount = Buffer.alloc(4);
    inputCount.writeUInt32BE(transaction.inputs.length);
    var inputs = Buffer.concat(transaction.inputs.map(function(input){
        // Output transaction hash
        var outputHash = Buffer.from(input.referencedOutputHash, 'hex');
        // Output transaction index
        var outputIndex = Buffer.alloc(4);
        // Signed may be -1
        outputIndex.writeInt32BE(input.referencedOutputIndex);
        var unlockScriptLength = Buffer.alloc(4);
        // For signing
        if (!withoutUnlockScript) {
            // Script length
            unlockScriptLength.writeUInt32BE(input.unlockScript.length);
            // Script
            var unlockScript = Buffer.from(input.unlockScript, 'binary');
            return Buffer.concat([outputHash, outputIndex, unlockScriptLength, unlockScript]);
        }
        // 0 input
        unlockScriptLength.writeUInt32BE(0);
        return Buffer.concat([outputHash, outputIndex, unlockScriptLength]);
    }));
    var outputCount = Buffer.alloc(4);
    outputCount.writeUInt32BE(transaction.outputs.length);
    var outputs = Buffer.concat(transaction.outputs.map(function(output) {
        // Output value
        var value = Buffer.alloc(4);
        value.writeUInt32BE(output.value);
        // Script length
        var lockScriptLength = Buffer.alloc(4);
        lockScriptLength.writeUInt32BE(output.lockScript.length);
        // Script
        var lockScript = Buffer.from(output.lockScript);
        return Buffer.concat([value, lockScriptLength, lockScript]);
    }));
    return Buffer.concat([version, inputCount, inputs, outputCount, outputs]);
};

// Sign transaction
exports.sign = function (transaction, keys) {
    var message = toBinary(transaction, true);
    transaction.inputs.forEach(function(input, index) {
        var key = keys[index];
        var signature = utils.sign(message, key.privateKey);
        // Genereate unlock script
       input.unlockScript = 'PUB ' + key.publicKey + ' SIG ' + signature;
    });
};

