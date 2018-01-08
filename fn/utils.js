var crypto = require('crypto');
var _ = require('lodash');
var bitInt = require('big-integer');
var ursa = require('ursa');

var HASH_ALGORITHM = 'sha256';


    // SHA256 hash
var hash = function (data) {
    var hash = crypto.createHash(HASH_ALGORITHM);
    hash.update(data);
    return hash.digest();
};

exports.hash = function (data) {
    var hash = crypto.createHash(HASH_ALGORITHM);
    hash.update(data);
    return hash.digest();
};

    // Convert hex to big int
    exports.hexToBigInt = function (hex) {
        return bitInt(hex, 16);
    };

    var generateKey = function () {
        // Same as openssl genrsa -out key-name.pem <modulusBits>
        return ursa.generatePrivateKey(1024, 65537);
    };

exports.verify = function (message, publicKeyHex, signatureHex) {
        // Create public key form hex
        var publicKey = ursa.createPublicKey(Buffer.from(publicKeyHex, 'hex'));
        // Create verifier
        var verifier = ursa.createVerifier(HASH_ALGORITHM);
        // Push message to verifier
        verifier.update(message);
        // Check with public key and signature
        return verifier.verify(publicKey, signatureHex, 'hex');
    };

exports.sign = function (message, privateKeyHex) {
        // Create private key form hex
        var privateKey = ursa.createPrivateKey(Buffer.from(privateKeyHex, 'hex'));
        // Create signer
        var signer = ursa.createSigner(HASH_ALGORITHM);
        // Push message to verifier
        signer.update(message);
        // Sign
        return signer.sign(privateKey, 'hex');
    };

exports.generateAddress = function () {
        var privateKey = generateKey();
        var publicKey = privateKey.toPublicPem();
        return {
            privateKey: privateKey.toPrivatePem('hex'),
            publicKey: publicKey.toString('hex'),
            // Address is hash of public key
            address: hash(publicKey).toString('hex')
        };
    };


