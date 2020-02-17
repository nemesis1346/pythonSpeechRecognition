#!/bin/bash

cd ..
sudo npx sequelize-cli db:migrate:undo --env=production
sudo npx sequelize-cli db:drop --env=production
sudo npx sequelize-cli db:create --env=production
sudo npx sequelize-cli db:migrate --env=production


#TESTING COMMANDS
# npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string