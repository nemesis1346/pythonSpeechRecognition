#!/bin/bash

set -x
set -e

#front end
cd /home/apps/speech/react_front_end
if [ -d build ]; then
    rm -r build
fi
tar zxf build.tgz

# server
cd /home/apps/speech/nodejs_server

#npm install
if [ -d node_modules ]; then
    rm -r node_modules
fi
tar zxf node_modules.tar.gz
sudo npx sequelize-cli db:migrate --env=production

sudo systemctl restart speech