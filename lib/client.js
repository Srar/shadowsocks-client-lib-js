"use strict";

const net = require("net");
const EventEmitter = require("events");

module.exports = class ShadowsocksClientSocket extends net.Socket {

    constructor(host, port, password, method, sRemoteHost, sRemotePort) {
        super();
        this.host = host;
        this.port = port;
        this.sRemoteHost = sRemoteHost;
        this.sRemotePort = sRemotePort;
        this.stage = 0;
        this.method = new (require("./crypto/" + method))(password);
        this.cb = null;
    }

    connect(callback) {
        this.cb = callback;
        super.connect(this.port, this.host, this.onConnected.bind(this));
        super.on("data", this.onData);
    }

    onConnected() {
        var isIPAddress = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/.test(this.sRemoteHost);
        var buffer;
        if (isIPAddress) {
            var items = this.sRemoteHost.split(".");
            buffer = Buffer.allocUnsafe(7);
            buffer[0] = 0x01;
            buffer[1] = items[0];
            buffer[2] = items[1];
            buffer[3] = items[2];
            buffer[4] = items[3];
            buffer[5] = ((this.sRemotePort >> 8) & 0xff);
            buffer[6] = (this.sRemotePort & 0xff);
        } else {
            buffer = Buffer.allocUnsafe(1 + 1 + this.sRemoteHost.length + 2);
            buffer[0] = 0x03;
            buffer[1] = this.sRemoteHost.length;
            buffer.write(this.sRemoteHost, 2);
            buffer[buffer.length - 2] = ((this.sRemotePort >> 8) & 0xff);
            buffer[buffer.length - 1] = (this.sRemotePort & 0xff);
        }
        super.write(this.method.encryptData(buffer), this.cb);
    }

    onData(data) {
        this.emit("ssdata", this.method.decryptData(data));
    }
}