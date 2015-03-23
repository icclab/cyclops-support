#!/bin/bash
function user_input(){
    local X_DEFAULT="$2"
    local X=""
    read -p "$1 [$X_DEFAULT]: " X
    X="${X:-$X_DEFAULT}"
    echo $X
}

echo "---------------------------------------------------------------------------"
echo "| Updating APT-GET"
echo "---------------------------------------------------------------------------"
apt-get update

echo "---------------------------------------------------------------------------"
echo "| Installing Unzip"
echo "---------------------------------------------------------------------------"
apt-get install -y unzip

echo "---------------------------------------------------------------------------"
echo "| Installing OpenJDK"
echo "---------------------------------------------------------------------------"
apt-get install -y openjdk-7-jdk

echo "---------------------------------------------------------------------------"
echo "| Setting JAVA_HOME"
echo "---------------------------------------------------------------------------"
JAVA_PATH=$(find / -name jre)
export JAVA_HOME=${JAVA_PATH}
echo "Java installed in: ${JAVA_HOME}"

echo "---------------------------------------------------------------------------"
echo "| Installing ANT"
echo "---------------------------------------------------------------------------"
apt-get install -y ant

echo "---------------------------------------------------------------------------"
echo "| Installing Tomcat"
echo "---------------------------------------------------------------------------"
apt-get install -y tomcat7

echo "---------------------------------------------------------------------------"
echo "| Changing Tomcat Permission"
echo "---------------------------------------------------------------------------"
chown -R tomcat7:tomcat7 /usr/share/tomcat7/

echo "---------------------------------------------------------------------------"
echo "| Changing Tomcat Arguments"
echo "---------------------------------------------------------------------------"
cwd=$(pwd)
cd /usr/share/tomcat7/bin/

cat >> setenv.sh <<EOL
export CATALINA_OPTS="-Xms1024m -Xmx1024m -XX:PermSize=128m -XX:MaxPermSize=128m -server"
EOL

chmod +x setenv.sh

cd ${cwd}

echo "---------------------------------------------------------------------------"
echo "| Assembling OpenAM WAR"
echo "---------------------------------------------------------------------------"
cd openam
jar cvf OpenAM-12.0.0.war OpenAM-12.0.0

echo "---------------------------------------------------------------------------"
echo "| Deploying OpenAM"
echo "---------------------------------------------------------------------------"
mv OpenAM-12.0.0.war /var/lib/tomcat7/webapps/openam.war

echo "---------------------------------------------------------------------------"
echo "| Compiling Dashboard"
echo "---------------------------------------------------------------------------"
cd ../../
ant

echo "---------------------------------------------------------------------------"
echo "| Deploying Dashboard"
echo "---------------------------------------------------------------------------"
mv out/dashboard.war /var/lib/tomcat7/webapps/dashboard.war
cd ${cwd}/openam

echo "---------------------------------------------------------------------------"
echo "| Starting Tomcat"
echo "---------------------------------------------------------------------------"
service tomcat7 restart

echo "---------------------------------------------------------------------------"
echo "| Unpacking OpenAM Config Tools"
echo "---------------------------------------------------------------------------"
mkdir -p config-tools
cd config-tools
unzip ../SSOConfiguratorTools-12.0.0.zip

echo "---------------------------------------------------------------------------"
echo "| Creating OpenAM Base Configuration File"
echo "---------------------------------------------------------------------------"
SERVER_URL=$(user_input "OpenAM URL" "http://openam.example.com:8080")
COOKIE_DOMAIN=$(user_input "Cookie Domain" ".example.com")
CONFIG_DIR=$(user_input "Configuration Directory" "/home/ubuntu")
LOCALE=$(user_input "Locale" "en_US")
ENC_KEY=$(user_input "OpenAM Encryption Password" "")
ADMIN_KEY=$(user_input "OpenAM amadmin Password (min. 8 characters)" "k41dkApc")
AGENT_KEY=$(user_input "OpenAM UrlAccessAgent Password (min. 8 characters)" "LC3cqOW2")
DS_SSL=$(user_input "Directory Store Security. Either SIMPLE or SSL" "SIMPLE")
DS_SERVER=$(user_input "Directory Server Address" "openam.example.com")
DS_PORT=$(user_input "Directory Server Port" "50389")
DS_PORT_ADMIN=$(user_input "Directory Server Administration Port" "4444")
DS_PORT_JMX=$(user_input "Directory Server JMX Port" "1689")
DS_PWD=$(user_input "Directory Server Password (min. 8 characters)" "orW2V4ah")

cat > openam-config <<EOL
SERVER_URL=${SERVER_URL}
DEPLOYMENT_URI=/openam
COOKIE_DOMAIN=${COOKIE_DOMAIN}
BASE_DIR=${CONFIG_DIR}
locale=${LOCALE}
PLATFORM_LOCALE=${LOCALE}
AM_ENC_KEY=${ENC_KEY}
ADMIN_PWD=${ADMIN_KEY}
AMLDAPUSERPASSWD=${AGENT_KEY}
ACCEPT_LICENSES=true

DATA_STORE=embedded
DIRECTORY_SSL=${DS_SSL}
DIRECTORY_SERVER=${DS_SERVER}
DIRECTORY_PORT=${DS_PORT}
DIRECTORY_ADMIN_PORT=${DS_PORT_ADMIN}
DIRECTORY_JMX_PORT=${DS_PORT_JMX}
ROOT_SUFFIX=dc=openam,dc=forgerock,dc=org
DS_DIRMGRDN=cn=Directory Manager
DS_DIRMGRPASSWD=${DS_PWD}
EOL

echo "---------------------------------------------------------------------------"
echo "| Applying OpenAM Configuration (might take a while)"
echo "---------------------------------------------------------------------------"
mkdir -p ${CONFIG_DIR}
chown tomcat7:tomcat7 ${CONFIG_DIR}
java -jar openam-configurator-tool-12.0.0.jar -f openam-config
cd ..

echo "---------------------------------------------------------------------------"
echo "| Unpacking OpenAM Admin Tools"
echo "---------------------------------------------------------------------------"
mkdir -p admin-tools
cd admin-tools
unzip ../SSOAdminTools-12.0.0.zip

#echo "---------------------------------------------------------------------------"
#echo "| Installing OpenAM Admin Tools"
#echo "---------------------------------------------------------------------------"
#echo ${ADMIN_KEY} > /tmp/amadmin.pwd
#chmod 400 /tmp/amadmin.pwd

#LOG_DIR=${CONFIG_DIR}/ssoadm-log
#DEBUG_DIR=${CONFIG_DIR}/ssoadm-dbg

#mkdir -p ${LOG_DIR}
#mkdir -p ${DEBUG_DIR}

#./setup -p ${CONFIG_DIR} -d ${DEBUG_DIR} -l ${LOG_DIR}

#cd ..

#echo "---------------------------------------------------------------------------"
#echo "| Cleaning Up"
#echo "---------------------------------------------------------------------------"
#rm /tmp/amadmin.pwd
