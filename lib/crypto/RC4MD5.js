const crypto = require("crypto");
const tools = require("./tools");

module.exports = class RC4MD5 {

    constructor(password) {
        this.password = password;
        this.keyLength = 16;
        this.ivLength = 16;
        this.cryptoName = "rc4-md5";
        this.isFirstEncryptData = true;
        this.isFirstDecryptData = true;
        this.encryptProcess = null;
        this.decryptProcess = null;
        if (!password) {
            return;
        }
        this.cryptoKeyIV = tools.createKeyIVByPassword(this.password, this.keyLength, this.ivLength);
    }

    encryptData(data) {
        if (this.isFirstEncryptData) {
            this.isFirstEncryptData = false;
            this.cryptoKeyIV.iv = crypto.randomBytes(this.ivLength);
            var rc4Process = tools.createKeyIVByPasswordForRC4MD5(this.cryptoKeyIV);
            this.encryptProcess = crypto.createCipheriv("rc4", rc4Process, "");
            return Buffer.concat([this.cryptoKeyIV.iv, this.encryptProcess.update(data)]);
        }
        return this.encryptProcess.update(data);
    }

    decryptData(data) {
        if (this.isFirstDecryptData) {
            this.isFirstDecryptData = false;
            var decryptIV = data.slice(0, this.ivLength);
            var rc4Process = tools.createKeyIVByPasswordForRC4MD5({ key: this.cryptoKeyIV.key, iv: decryptIV });
            this.decryptProcess = crypto.createDecipheriv("rc4", rc4Process, "");
            return this.decryptProcess.update(data.slice(this.ivLength));
        }
        return this.decryptProcess.update(data);
    }
}