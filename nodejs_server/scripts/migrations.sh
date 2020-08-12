#!/bin/bash
cd ..

npx sequelize-cli migration:create --name create_users_table --env=production
npx sequelize-cli migration:create --name create_speech_files_table --env=production