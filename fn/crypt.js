var crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const KEY = 'HJK5hk5jfs45KJRRSE45Khk5jjkdh4KJHR2';

exports.encrypt = function(text){
    var cipher = crypto.createCipher(algorithm,KEY);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
};

exports.decrypt = function(text){
    var decipher = crypto.createDecipher(algorithm,KEY);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
};
