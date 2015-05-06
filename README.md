# Sawyer [![GitHub tag][tag-img]][tag]

Squaring up logs and shipping them to Redis for Logstash

Sawyer is a Node.js application that takes logs as input and puts them into Redis for
[Logstash][logstash] to process.  

## Use Cases

* Shipping Windows logs from [NXLog Community Edition][nxlog-ce] to Redis.
* Getting logs into Redis from sources that cannot have a Logstash shipper installed
  on them. Examples of such sources include firewalls, load balancers, and network switches.
  Data from these sources is parsed and converted to JSON prior to placing in Redis.
* Receiving structured data from applications or devices and placing it into Redis. Examples of
  this include:
  * firewall logs pre-formatted as JSON to reduce post-processing.
  * sending logs directly from an application in either JSON or
    [GELF][gelf-from-app] format.

## Data Flow

As with most things, there are many ways to accomplish the same task. Below are
the data flows that Sawyer is being written and tested against:

* Firewall >> Sawyer @ ls.example.com:6370 >> Redis on localhost:6379 >>
  Logstash >> Elasticsearch
* Windows Event Log >> NXLog on localhost >> Sawyer @ ls.example.com:6371 >>
  Redis on localhost:6379 >> Logstash >> Elasticsearch

## Current Status

### Works today

Sawyer currently can receive syslog and JSON data via UDP, parse it, and place
it in Redis for Logstash to pickup. This works with or without a password on the
Redis instance. By default, Sawyer

* listens for syslog on `0.0.0.0:6370`,
* listens for JSON on `0.0.0.0:6371`, and
* talks to Redis on `127.0.0.1:6379`.

It strips these characters from the `Message` field: `\r \n \t` as Windows
EventLog places quite a few of these in its output.

### In development

Next up is receiving JSON from sources other than EventLog. After that I plan to
look into receiving GELF messages.


[gelf-from-app]:http://docs.graylog.org/en/latest/pages/sending_data.html#gelf-sending-from-applications
[logstash]:http://logstash.net
[nxlog-ce]:http://nxlog.org/products/nxlog-community-edition
[tag]: https://github.com/genebean/sawyer
[tag-img]: https://img.shields.io/github/tag/genebean/sawyer.svg?style=plastic&label=Current%20Release
