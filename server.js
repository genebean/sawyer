var config        = require('config');
var dgram         = require('dgram');
var redis         = require('redis');
var syslogParser  = require('glossy').Parse;

var redis_host    = config.get('sawyer.redis_host');
var redis_port    = config.get('sawyer.redis_port');
var redis_pass    = config.get('sawyer.redis_password');
var socket_json   = dgram.createSocket('udp4');
var socket_syslog = dgram.createSocket('udp4');

socket_json.bind(6371);
socket_syslog.bind(6370);


function isEmpty(str) {
    return (!str || 0 === str.length);
}

// connect using a password if one was provided
if (isEmpty(redis_pass)) {
  var redis_client = redis.createClient(redis_port, redis_host, {});
} else {
  var redis_client = redis.createClient(redis_port, redis_host, {auth_pass: redis_pass});
}


redis_client.on('connect', function() {
  if (isEmpty(redis_pass)) {
    console.log('Connected to Redis on ' + redis_host + ':' + redis_port);
  } else {
    console.log('Connected to Redis with provided password on ' + redis_host + ':' + redis_port);
  }
});

// JSON section
socket_json.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  socket_json.close();
});

socket_json.on("message", function (msg, rinfo) {
  var jsonMessage = msg.toString('utf8');
  var jsonObj = JSON.parse(jsonMessage);

  // replace newline characters and tabs with a space
  cleanedUpMessage = jsonObj.Message.replace(/\r|\n|\t/g, " ");
  jsonObj.Message = cleanedUpMessage;

  jsonObj.type              = 'sawyer-json';
  jsonObj.tags              = ['sawyer'];
  jsonObj.sawyer_log_source = rinfo.address;

  //console.log(jsonObj);
  //console.log(JSON.stringify(jsonObj));
  //console.log('\n');

  redis_client.rpush(['logstash', JSON.stringify(jsonObj)], function(err, reply) {
    //console.log('result of rpush: ' + reply);
  });
});

socket_json.on("listening", function () {
  var address = socket_json.address();
  console.log("Sawyer is listening for json messages on " +
      address.address + ":" + address.port);
});


// Syslog section
socket_syslog.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  socket_syslog.close();
});

socket_syslog.on("message", function (msg, rinfo) {
  syslogParser.parse(msg.toString('utf8', 0), function(parsedMessage){
    delete parsedMessage.originalMessage;
    parsedMessage.syslog_type       = parsedMessage.type;
    parsedMessage.type              = 'sawyer-syslog';
    parsedMessage.tags              = ['sawyer'];
    parsedMessage.sawyer_log_source = rinfo.address;

    redis_client.rpush(['logstash', JSON.stringify(parsedMessage)], function(err, reply) {
      //console.log('result of rpush: ' + reply);
    });

    //console.log(JSON.stringify(parsedMessage));
    //console.log('\n');
  });
});

socket_syslog.on("listening", function () {
  var address = socket_syslog.address();
  console.log("Sawyer is listening for syslog messages on " +
      address.address + ":" + address.port);
});
