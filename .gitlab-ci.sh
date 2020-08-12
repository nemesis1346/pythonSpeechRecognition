#!/bin/bash
export LC_ALL=""
export LANG="en_US.UTF-8"
export DEBIAN_FRONTEND=noninteractive
export UCF_FORCE_CONFFOLD=yes

set -x
set -e

sudo apt update --fix-missing

mkdir -p /home/apps/speech
# remove source code deployed before
rm -rf /home/apps/speech/*
mkdir -p /home/apps/speech/react_front_end

#front end
tar xzvf react_front_end/build.tgz -C /home/apps/speech/react_front_end
sudo chown -R www-data /home/apps/speech/react_front_end/build
#backend
tar xzvf nodejs_server.tar.gz -C /home/apps/speech/
#node_modules
if [ -d /home/apps/speech/nodejs_server ]; then
    tar xzvf nodejs_server/node_modules.tar.gz -C /home/apps/speech/nodejs_server
fi

#build server and db
if [ `systemctl is-enabled mariadb` == "enabled" ]; then
# if service --status-all | grep -Fq 'mariadb'; then 
    echo "MariaDB already installed."
else
    sudo bash install_mariadb.sh
fi

if [ ! -d /bigdisk/speech/audio_files ]; then
    sudo mkdir -p /bigdisk/speech/audio_files
    sudo mkdir -p /bigdisk/speech/text_files
fi
if [ ! -d /home/apps/speech/audio_files ]; then
    sudo ln -s /bigdisk/speech/audio_files /home/apps/speech/audio_files
fi
if [ ! -d  /home/apps/speech/text_files ]; then
    sudo ln -s /bigdisk/speech/text_files /home/apps/speech/text_files
fi
if [ ! -d /etc/apache2/sites-enabled/custom ]; then
sudo mkdir /etc/apache2/sites-enabled/custom
fi

#dependencies
sudo apt -y install alsa alsa-tools ffmpeg libsox-fmt-mp3 sox build-essential libasound2-dev libpulse-dev

#copy files
sudo cp speech.inc /etc/apache2/sites-enabled/custom/
sudo cp speech.service /etc/systemd/system/
sudo cp speech_conversion.service /etc/systemd/system/
sudo cp check-cronjob.sh /home/apps/speech

cd /home/apps/speech/nodejs_server
npm cache verify
# npm install 
# sudo npx sequelize-cli db:drop --env=production #this needs to be changed after the prod servers
sudo npx sequelize-cli db:create --env=production
sudo npx sequelize-cli db:migrate --env=production
cd /home/apps/speech/

#services
sudo systemctl reload apache2
sudo systemctl daemon-reload
sudo systemctl enable speech
sudo systemctl restart speech
sudo systemctl enable speech_conversion
sudo systemctl restart speech_conversion

#remove unnecesary files
sudo rm -rf /home/apps/speech/nodejs_server/node_modules.tar.gz
