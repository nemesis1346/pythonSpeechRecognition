"use strict";

require('dotenv').config({ path: '.env.production' }) // for other environments

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_URL,
        port: process.env.DB_PORT,
        dialect: process.env.DB_ENGINE,
        operatorsAliases: false
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        port: process.env.DB_PORT,
        dialect: process.env.DB_ENGINE,
        operatorsAliases: false

    }
};