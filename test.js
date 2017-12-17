const ShadowsocksClientSocket = require("./index");

var client = new ShadowsocksClientSocket("0.0.0.0", 1433, "password", "RC4MD5", "google.com", 80);

client.connect(function () {
    client.write(`GET / HTTP/1.1
    Host: server.x-speed.cc
    User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
    DNT: 1
    Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,ja;q=0.6,ko;q=0.5`);
});

client.on("ssdata", function (data) {
    console.log(data.toString());
});

client.on("close", function () {
    console.log("closed");
});

client.on("error", function (err) {
    console.error(err);
});