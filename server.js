var config       = require('config');
var dgram        = require('dgram');
var redis        = require('redis');
var syslogParser = require('glossy').Parse;

var redis_host   = config.get('sawyer.redis_host');
var redis_port   = config.get('sawyer.redis_port');
var redis_pass   = config.get('sawyer.redis_password');

function isEmpty(str) {
    return (!str || 0 === str.length);
}

// connection using a password if one was provided
if (isEmpty(redis_pass)) {
  var redis_client = redis.createClient(redis_port, redis_host, {});
} else {
  var redis_client = redis.createClient(redis_port, redis_host, {auth_pass: redis_pass});
}

var socket       = dgram.createSocket('udp4');

redis_client.on('connect', function() {
    console.log('connected to Redis on ' + redis_host + ':' + redis_port);
});

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
