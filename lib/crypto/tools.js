const crypto = require("crypto");

module.exports = {

    createKeyIVByPassword: function (password, keyLength, ivLength) {
        password = new Buffer(password, "binary");
        var hashBuffers = [];
        for (var dataCount = 0, loopCount = 0; dataCount < keyLength + ivLength; loopCount++) {
            var data = password;
            if (loopCount > 0) {
                data = Buffer.concat([hashBuffers[loopCount - 1], password]);
            }
            var md5 = crypto.createHash("md5");
            var md5Buffer = md5.update(data).digest();
            hashBuffers.push(md5Buffer);
            dataCount += md5Buffer.length;
        }
        var hashBuffer = Buffer.concat(hashBuffers);
        var key = hashBuffer.slice(0, keyLength);
        var iv = hashBuffer.slice(keyLength, keyLength + ivLength);
        return {
            key: key, iv: iv
        };
    },

    createKeyIVByPasswordForRC4MD5: function (kv) {
        var md5 = crypto.createHash("md5");
        md5.update(kv.key);
        md5.update(kv.iv);
        var hash = md5.digest();
        return hash;
    }
    
}