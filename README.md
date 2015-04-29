# Sawyer

Squaring up logs and shipping them to Redis for Logstash

Sawyer is a Node.js application that takes logs as input and puts them into Redis for
Logstash to process.  

## Use Cases

Sawyer has three main use cases: 

1. Shipping Windows logs from [NXLog Community Edition][nxlog-ce] to Redis.
2. Getting logs into Redis from sources that cannot have a Logstash shipper installed 
  on them. Examples of such sources include firewalls, load balancers, network switches, etc.
3. Receiving structured data from applications like via custom output formats. Examples of
  this include:
  * formatting firewall logs in JSON to reduce post-processing efforts
  * sending logs from within an application in [GELF format][gelf-from-app]
  * sending logs from within an application in JSON format

## Data Flow

As with most things, there are many ways to accomplis the same task. Below is the data flows that
Sawyer is being written and tested against:

[Firewall] > [Sawyer on logserver.example.com:6370] > [Redis on localhost:6379] > [Logstash] > [Elasticsearch]
[Windows Event Log] > [NXLog on localhost] > [Redis on localhost:6379] > [Logstash] > [Elasticsearch]

[gelf-from-app]:http://docs.graylog.org/en/latest/pages/sending_data.html#gelf-sending-from-applications
[nxlog-ce]:http://nxlog.org/products/nxlog-community-edition
