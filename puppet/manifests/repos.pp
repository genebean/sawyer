Package { allow_virtual => true, }

yumrepo { 'logstash-1.4':
  ensure   => 'present',
  baseurl  => 'http://packages.elasticsearch.org/logstash/1.4/centos',
  descr    => 'logstash repository for 1.4.x packages',
  enabled  => '1',
  gpgcheck => '1',
  gpgkey   => 'http://packages.elasticsearch.org/GPG-KEY-elasticsearch',
}

yumrepo { 'elasticsearch-1.5':
  ensure   => 'present',
  baseurl  => 'http://packages.elasticsearch.org/elasticsearch/1.5/centos',
  descr    => 'Elasticsearch repository for 1.5.x packages',
  enabled  => '1',
  gpgcheck => '1',
  gpgkey   => 'http://packages.elasticsearch.org/GPG-KEY-elasticsearch',
}

