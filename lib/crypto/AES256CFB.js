const crypto = require("crypto");
const tools = require("./tools");
const AESCryptoProcess = require("./Share/AESCryptoProcess");

module.exports = class RC4MD5 {
    constructor(password) {
        this.password = password;
        this.keyLength = 32;
        this.ivLength = 16;
        this.cryptoName = "aes-256-cfb";
        if (!password) {
            return;
        }
        this.cryptoKeyIV = tools.createKeyIVByPassword(this.password, this.keyLength, this.ivLength);
        this.cryptoProcess = new AESCryptoProcess(this.cryptoName, this.cryptoKeyIV.key, this.cryptoKeyIV.iv);
    }
    encryptData(data) {
        return this.cryptoProcess.encryptData(data);
    }
    decryptData(data) {
        return this.cryptoProcess.decryptData(data);
    }
}