var config        = require('config');
var dgram         = require('dgram');
var redis         = require('redis');
var syslogParser  = require('glossy').Parse;

var redisHost    = config.get('sawyer.redis_host');
var redisPort    = config.get('sawyer.redis_port');
var redisPass    = config.get('sawyer.redis_password');
var socketJson   = dgram.createSocket('udp4');
var socketSyslog = dgram.createSocket('udp4');

socketSyslog.bind(6370);
socketJson.bind(6371);


function isEmpty(str) {
    return (!str || 0 === str.length);
}

// connect using a password if one was provided
var redisClient;
if (isEmpty(redisPass)) {
  redisClient = redis.createClient(redisPort, redisPost, {});
} else {
  redisClient = redis.createClient(redisPort, redisHost, { auth_pass: redisPass });
}


redisClient.on('connect', function() {
  if (isEmpty(redisPass)) {
    console.log('Connected to Redis on ' + redisHost + ':' + redisPort);
  } else {
    console.log('Connected to Redis with provided password on ' + redisHost + ':' + redisPort);
  }
});

// JSON section
socketJson.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  socketJson.close();
});

socketJson.on("message", function (msg, rinfo) {
  var jsonObj     = JSON.parse(msg.toString('utf8'));
  var tags        = jsonObj.tags || [];
  tags.push('sawyer');

  jsonObj.tags              = tags;
  jsonObj.type              = 'sawyer-json';
  jsonObj.sawyer_log_source = rinfo.address;

  //console.log(jsonObj);
  //console.log(JSON.stringify(jsonObj));
  //console.log('\n');

  redisClient.rpush([ 'logstash', JSON.stringify(jsonObj) ], function(err, reply) {
    //console.log('result of rpush: ' + reply);
  });
});

socketJson.on("listening", function () {
  var address = socketJson.address();
  console.log("Sawyer is listening for json messages on " +
      address.address + ":" + address.port);
});


// Syslog section
socketSyslog.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  socketSyslog.close();
});

socketSyslog.on("message", function (msg, rinfo) {
  syslogParser.parse(msg.toString('utf8', 0), function(parsedMessage) {

    var tags = parsedMessage.tags || [];
    tags.push('sawyer');

    delete parsedMessage.originalMessage;
    parsedMessage.syslog_type       = parsedMessage.type;
    parsedMessage.type              = 'sawyer-syslog';
    parsedMessage.tags              = tags;
    parsedMessage.sawyer_log_source = rinfo.address;

    redisClient.rpush([ 'logstash', JSON.stringify(parsedMessage) ], function(err, reply) {
      //console.log('result of rpush: ' + reply);
    });

    //console.log(JSON.stringify(parsedMessage));
    //console.log('\n');
  });
});

socketSyslog.on("listening", function () {
  var address = socketSyslog.address();
  console.log("Sawyer is listening for syslog messages on " +
      address.address + ":" + address.port);
});
