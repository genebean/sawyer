var syslogParser = require('glossy').Parse;
var dgram = require("dgram");
var socket = dgram.createSocket("udp4");

socket.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  socket.close();
});

socket.on("message", function (msg, rinfo) {
  syslogParser.parse(msg.toString('utf8', 0), function(parsedMessage){
    parsedMessage.tags = ['sawyer'];
    parsedMessage.sawyer_log_source = rinfo.address;

    console.log(JSON.stringify(parsedMessage));
  });
});

socket.on("listening", function () {
  var address = socket.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

socket.bind(6370);
