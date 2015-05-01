Package { allow_virtual => true, }

include redis::install

redis::server { 'logstash_instance':
  redis_ip => '0.0.0.0',
  running  => true,
  enabled  => true,
}

$logstash_config_hash = {
}

class { 'logstash':
  install_contrib => true,
  init_defaults   => $logstash_config_hash,
}

service { 'elasticsearch':
  ensure => running,
  enable => true,
}

