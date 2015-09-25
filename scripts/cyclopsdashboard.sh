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

sudo apt-get install -y sqlite

### creating required folders ###
mkdir $HOME/bills/
chmod 777 $HOME/bills/
mkdir $HOME/sqlite/
chmod 777 $HOME/sqlite/
sudo mkdir -p /var/log/dashboard/
sudo chmod 777 /var/log/dashboard/
sudo -k

### getting the dashboard code and installing it ###
git clone https://github.com/icclab/cyclops-dashboard.git
cd cyclops-dashboard
nano src/main/webapp/WEB-INF/configuration.txt
mvn clean install
cd target
sudo cp *.war /var/lib/tomcat7/webapps/dashboard.war
sudo service tomcat7 restart
sudo -k

### initializing the database ###
sqlite3 $HOME/sqlite/dashboard.db "CREATE TABLE IF NOT EXISTS meter_source (ID INTEGER PRIMARY KEY, source        TEXT    NOT NULL);";
sqlite3 $HOME/sqlite/dashboard.db "CREATE TABLE IF NOT EXISTS bills (ID INTEGER PRIMARY KEY, userId        TEXT    NOT NULL, billPDF       TEXT    NOT NULL, fromDate      TEXT    NOT NULL, toDate        TEXT    NOT NULL, approved      BOOLEAN NOT NULL DEFAULT 0, paid          BOOLEAN NOT NULL DEFAULT 0, dueDate       TEXT    NOT NULL, paymentDate   TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP);";
sqlite3 $HOME/sqlite/dashboard.db "CREATE TABLE IF NOT EXISTS external_id (ID INTEGER PRIMARY KEY, userId        TEXT    NOT NULL, meterSourceId INTEGER NOT NULL, meterUserId   TEXT    NOT NULL);";
sqlite3 $HOME/sqlite/dashboard.db "CREATE TABLE IF NOT EXISTS gatekeeper_users (username      TEXT        PRIMARY KEY, password      TEXT        NOT NULL, userId        TEXT        NOT NULL);";
sqlite3 $HOME/sqlite/dashboard.db "CREATE TABLE  IF NOT EXISTS dashboard_users (username          TEXT        PRIMARY KEY, password           TEXT        NOT NULL, name               TEXT        NOT NULL, surname            TEXT        NOT NULL, email              TEXT        NOT NULL, isAdmin            BOOLEAN     NOT NULL, keystoneId         TEXT);";
chmod 777 $HOME/sqlite/dashboard.db
cd

rm -fR cyclops-dashboard
echo "Installation complete. You can access dashboard at http://ip:8080/dashboard/app"