#!/bin/bash

set -x
set -e

git config core.fileMode false
sudo apt update --fix-missing

# if [ `systemctl is-enabled mariadb` == "enabled" ]; then
#     echo "MariaDB already installed."
# else
#     sudo bash /home/apps/speech/install_mariadb.sh
# fi

cd /home/apps/speech/react_front_end
if [ -d build ]; then
    rm -r build
fi
tar zxf build.tgz

if [ ! -d /home/apps/speech/react_front_end/build ]; then
    echo "React app not built yet"
else
    sudo chown -R www-data /home/apps/speech/react_front_end/build
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


sudo apt -y install alsa alsa-tools ffmpeg libsox-fmt-mp3 sox build-essential libasound2-dev libpulse-dev

echo "Finished apt install"

# server
cd /home/apps/speech/nodejs_server
#npm install
if [ -d node_modules ]; then
    rm -r node_modules
fi
tar zxf node_modules.tar.gz

#copy files
cd /home/apps/speech
sudo cp speech.inc /etc/apache2/sites-enabled/custom/
sudo cp speech.service /etc/systemd/system/
sudo cp speech_conversion.service /etc/systemd/system/

cd /home/apps/speech/nodejs_server
npm cache verify
# npm install 
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

sudo systemctl reload apache2
