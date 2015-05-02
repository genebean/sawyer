# Sawyer

Squaring up logs and shipping them to Redis for Logstash

Sawyer is a Node.js application that takes logs as input and puts them into Redis for
Logstash to process.  

## Use Cases

* Shipping Windows logs from [NXLog Community Edition][nxlog-ce] to Redis.
* Getting logs into Redis from sources that cannot have a Logstash shipper installed
  on them. Examples of such sources include firewalls, load balancers, and network switches.
  Data from these sources is parsed and converted to JSON prior to placing in Redis.
* Receiving structured data from applications or devices and placing it into Redis. Examples of
  this include:
  * firewall logs output as JSON to reduce post-processing.
  * sending logs from within an application in either [GELF][gelf-from-app]
    or JSON format

## Data Flow

As with most things, there are many ways to accomplish the same task. Below are
the data flows that Sawyer is being written and tested against:

* [Firewall] > [Sawyer on ls.example.com:6370] > [Redis on localhost:6379] >
  [Logstash] > [Elasticsearch]
* [Windows Event Log] > [NXLog on localhost] > [Sawyer on ls.example.com:6371] >
  [Redis on localhost:6379] > [Logstash] > [Elasticsearch]

## Current Status

### Works today

Sawyer currently can receive syslog data via UDP, parse it, and place it in Redis
for Logstash to pickup. This works with or without a password on the Redis instance.
By default, Sawyer listens on `0.0.0.0:6370` and talks to Redis on `127.0.0.1:6379`.

### In development

Next up is receiving JSON and / or GELF from NXLog. The plan is to run this
input on port 6371.


[gelf-from-app]:http://docs.graylog.org/en/latest/pages/sending_data.html#gelf-sending-from-applications
[nxlog-ce]:http://nxlog.org/products/nxlog-community-edition
