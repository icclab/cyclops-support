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

### getting the cyclops-billing code and installing it ###
git clone https://github.com/icclab/cyclops-billing.git
cd cyclops-billing
nano src/main/webapp/WEB-INF/configuration.txt
mvn clean install
cd target
sudo cp cyclops*.war /var/lib/tomcat7/webapps/billing.war
sudo service tomcat7 restart
sudo -k
cd

rm -fR cyclops-billing