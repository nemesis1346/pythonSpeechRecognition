#!/bin/bash

set -x
set -e

mkdir -p /home/apps/speech
# remove source code deployed before
rm -rf /home/apps/speech/*
mkdir -p /home/apps/speech/react_front_end
mkdir -p /home/apps/speech/nodejs_server

if [ `systemctl is-enabled mariadb` == "enabled" ]; then
    echo "MariaDB already installed."
else
    sudo bash /home/apps/speech/install_mariadb.sh
fi

cd /home/apps/speech/react_front_end
if [ -d build ]; then
    rm -r build
fi
tar zxf build.tgz
cd ..

if [ ! -d /home/apps/speech/react_front_end/build ]; then
    echo "React app not built yet"
else
    sudo chown -R www-data /home/apps/speech/react_front_end/build
fi

if [ ! -d /bigdisk/speech/audio_files ]; then
    sudo mkdir -p /bigdisk/speech/audio_files
    sudo mkdir -p /bigdisk/speech/text_files
fi
if [ ! -d audio_files ]; then
    sudo ln -s /bigdisk/speech/audio_files audio_files
fi
if [ ! -d text_files ]; then
    sudo ln -s /bigdisk/speech/text_files text_files
fi

#additional 
#sudo pip3 install --upgrade speechrecognition
#sudo pip3 install --upgrade pocketsphinx

sudo apt -y install alsa alsa-tools ffmpeg libsox-fmt-mp3 sox build-essential libasound2-dev libpulse-dev

echo "Finished apt install"

# server
cd nodejs_server
#npm install
if [ -d node_modules ]; then
    rm -r node_modules
fi
tar zxf node_modules.tar.gz

# DB
# sudo npx sequelize-cli db:migrate:undo --env=production
# sudo npx sequelize-cli db:drop --env=production
sudo npx sequelize-cli db:create --env=production
sudo npx sequelize-cli db:migrate --env=production
#sudo npx sequelize-cli db:seed:all --env=production

cd ..
sudo cp speech.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable speech
sudo systemctl start speech

if [ ! -d /etc/apache2/sites-enabled/custom ]; then
sudo mkdir /etc/apache2/sites-enabled/custom
fi
sudo cp speech.inc /etc/apache2/sites-enabled/custom/

sudo systemctl reload apache2
