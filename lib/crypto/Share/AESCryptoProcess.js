const crypto = require("crypto");

module.exports = class AESCryptoProcess {
    constructor(cryptoName, KEY, IV) {
        this.cryptoName = cryptoName;
        this.KEY = KEY;
        this.IV = IV;
        this.isFirstEncryptData = true;
        this.isFirstDecryptData = true;
        this.encryptProcess = null;
        this.decryptProcess = null;
    }

    encryptData(data) {
        if (this.isFirstEncryptData) {
            this.isFirstEncryptData = false;
            var randomIV = crypto.randomBytes(this.IV.length);
            this.encryptProcess = crypto.createCipheriv(this.cryptoName, this.KEY, randomIV);
            return Buffer.concat([randomIV, this.encryptProcess.update(data)]);
        }
        return this.encryptProcess.update(data);
    }

    decryptData(data) {
        if (this.isFirstDecryptData) {
            this.isFirstDecryptData = false;
            var decryptIV = data.slice(0, this.IV.length);
            this.decryptProcess = crypto.createDecipheriv(this.cryptoName, this.KEY, decryptIV);
            return this.decryptProcess.update(data.slice(this.IV.length));
        }
        return this.decryptProcess.update(data);
    }
}