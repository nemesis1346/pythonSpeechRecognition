const Sequelize = require('sequelize');
if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: '../.env.production' }) // for other environments
} else {
    require('dotenv').config({ path: '../.env.development' })
}

var opts = {
    define: {
    freezeTableName: true
    }
}
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD, {
    host: process.env.DB_HOSTNAME,
    dialect: process.env.DB_ENGINE
}, opts);

module.exports = sequelize;

global.sequelize = sequelize;