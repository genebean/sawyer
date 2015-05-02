# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "genebean/centos6-puppet-64bit"
  config.vm.network "private_network", type: "dhcp"
  config.vm.synced_folder ".", "/vagrant", type: "nfs"

  config.vm.provision "shell", inline: "puppet module install elasticsearch-logstash"
  config.vm.provision "shell", inline: "puppet module install dwerder-redis"
  config.vm.provision "shell", inline: "touch /etc/puppet/hiera.yaml"
  config.vm.provision "shell", inline: "rpm --import https://packages.elasticsearch.org/GPG-KEY-elasticsearch"
  config.vm.provision "shell", inline: "curl -sL https://rpm.nodesource.com/setup | bash -"
  config.vm.provision "shell", inline: "puppet apply /vagrant/puppet/manifests/repos.pp"

  config.vm.provision "shell", inline: "yum install -y nodejs elasticsearch java-1.8.0-openjdk gcc-c++ make vim htop"
  config.vm.provision "shell", inline: "chkconfig --add elasticsearch"

  config.vm.provision "shell", inline: "puppet apply /vagrant/puppet/manifests/servers.pp"
  config.vm.provision "shell", inline: "cd /vagrant; npm install"

end

