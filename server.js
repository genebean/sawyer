var dgram = require("dgram");

var socket = dgram.createSocket("udp4");

socket.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  socket.close();
});

socket.on("message", function (msg, rinfo) {
  var jsonObj = { message: msg.toString('utf8').replace(/\r?\n|\r/g, " "), tags: ['sawyer'], sawyer_log_source: rinfo.address };
  console.log(JSON.stringify(jsonObj));
});

socket.on("listening", function () {
  var address = socket.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

socket.bind(6370);