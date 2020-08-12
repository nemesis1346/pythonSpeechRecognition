#!/bin/bash

set -x
set -e
cd /home/apps/speech/nodejs_server
sudo npx sequelize-cli db:drop --env=production
sudo npx sequelize-cli db:create --env=production
sudo npx sequelize-cli db:migrate --env=production