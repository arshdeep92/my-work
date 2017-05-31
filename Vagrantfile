# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.ssh.insert_key = false
  config.vm.box_url = "file://./ubuntu_dotcms.json"
  config.vm.box = "belfuse/dotcms"

  config.vm.define "belfuse-dotcms", primary: true do |b|
    b.vm.network "forwarded_port", guest: 8080, host: 8080
    b.vm.network "forwarded_port", guest: 8443, host: 8443
    b.vm.network "forwarded_port", guest: 8000, host: 8000
    b.vm.network "forwarded_port", guest: 22, host: 2224
    b.vm.network "private_network", ip: "192.168.56.210"

    b.vm.provider "virtualbox" do |vb|
      vb.customize [ "guestproperty", "set", :id, "/VirtualBox/GuestAdd/VBoxService/--timesync-set-threshold", 10000 ]
      if ENV['CPUs']
        vb.cpus = Integer(ENV['CPUs'])
      else
        vb.cpus = 2
      end
      if ENV['MEMORY']
        vb.memory = ENV['MEMORY']
      else
        vb.memory = "4196"
      end
    end
  end

  # Ansible Control Machine definition.
  config.vm.define "control", autostart: false do |control|

    control.ssh.insert_key = false
    control.vm.box = "ubuntu/trusty64"

    control.vm.network "private_network", ip: "192.168.56.212"
    control.vm.synced_folder "devops/", "/vagrant"
    control.vm.synced_folder ".", "/projectroot"

    # TODO: change provision over to ansible_local and test on Windows when Vagrant 1.8.2 is out.
    control.vm.provision "shell" do |sh|
      sh.path = "devops/local_ansible.sh"
      sh.args = ["/vagrant/control.yml", "/vagrant/requirements.yml"]
    end
    control.vm.provider "virtualbox" do |vb|
      if ENV['CONTROL_MEMORY']
        vb.memory = ENV['CONTROL_MEMORY']
      else
        vb.memory = "512"
      end
    end
  end

  # Second DotCMS box. Use this to test push-publishing. Will need a separate license after startup.
  config.vm.define "belfuse-dotcms-secondary", autostart: false do |b|
    b.vm.network "forwarded_port", guest: 8080, host: 8081
    b.vm.network "forwarded_port", guest: 8443, host: 8444
    b.vm.network "forwarded_port", guest: 2222, host: 2223
    b.vm.network "private_network", ip: "192.168.56.211"

    b.vm.provider "virtualbox" do |vb|
      vb.customize [ "guestproperty", "set", :id, "/VirtualBox/GuestAdd/VBoxService/--timesync-set-threshold", 10000 ]
      vb.memory = "2048"
    end
  end
end
