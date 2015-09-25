#!/bin/bash
# Copyright (c) 2015. Zuercher Hochschule fuer Angewandte Wissenschaften
# All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.
#
# Author: Piyush Harsh,
# URL: piyush-harsh.info

### building Influxdb client ###
git clone https://github.com/influxdb/influxdb-java.git
cd influxdb-java
rm -fR src/test
mvn clean install -DskipTests=true
cd
rm -fR influxdb-java 

### getting the UDR code and installing ###
git clone https://github.com/icclab/cyclops-udr.git
cd cyclops-udr
git checkout influx_0.9.x
nano src/main/webapp/WEB-INF/configuration.txt
mvn clean install
sudo mkdir -p /var/log/udr/
sudo chmod 777 /var/log/udr/
sudo cp target/udr*.war /var/lib/tomcat7/webapps/udr.war
sudo service tomcat7 restart
cd
rm -fR cyclops-udr

### setting the udr triggers for sensu ###
sudo wget -O /etc/sensu/conf.d/check_udr.json https://raw.githubusercontent.com/icclab/cyclops-udr/influx_0.9.x/support/check_udr.json
sudo wget -O /etc/sensu/plugins/checkudr.sh https://raw.githubusercontent.com/icclab/cyclops-udr/influx_0.9.x/support/checkudr.sh
sudo chmod 755 /etc/sensu/plugins/checkudr.sh

### restarting sensu services ###
sudo service sensu-server restart
sudo service sensu-client restart
sudo service sensu-api restart
sudo service uchiwa restart
sudo -k