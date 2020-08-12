
"use strict";
//Imports
if (process.env.NODE_ENV === 'production') {
  console.log('IS ENV PRODUCTION')
  require('dotenv').config({ path: '../.env.production' }) // for other environments
} else {
  console.log('IS ENV DEVELOPMENT')
  require('dotenv').config({ path: '../.env.development' })
}

const sequelizedb = require('../api/connection');
const Sequelize = require('sequelize');
const port = process.env.SERVER_PORT;
const host = process.env.SERVER_HOST;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const uploadFilesEndpoint = require("../endpoints/uploadFilesEndpoint.js");
const conversionUtilEndpoint = require('../endpoints/conversionUtilEndpoint.js');
const convertAllRecordsEndpoint = require('../endpoints/convertAllRecordsEndpoint');
const convertRecordEndpoint = require('../endpoints/convertRecordEndpoint');
const recordsEndpoint = require('../endpoints/recordsEndpoint.js');
const subrecordsEndpoint = require('../endpoints/subRecordsEndpoint.js');
const sessionEndpoint = require('../endpoints/sessionEndpoint');
const app = express();
const DataModel = require("../models/dataModel");
const fileUpload = require("express-fileupload");
const ENDPOINTS = require('../constants/server_endpoints');
const FOLDER_DIRECTORIES = require('../constants/folder_constants')
const path_resolve = require('path').resolve
const cookieParser = require('cookie-parser');
const url_parse = require('url-parse')
const fs = require('fs');

const server = require("http").createServer(app);
const io = require("socket.io")(server);
const schedule = require('node-schedule');
let isRecording = false;
const databaseApi = require('../api/databaseApi');


//cron job
var job;
job = schedule.scheduleJob('*/10 * * * * *', async function () {
        console.log('/////////////////////////////////////////////////////')
        console.log('/////////////////////////////////////////////////////')
        console.log('/////////////////////////////////////////////////////')
        console.log('This job was supposed to run at but actually ran at ' + new Date());
        await convertAllRecordsEndpoint.convertAllRecords(FOLDER_DIRECTORIES.AUDIO_FOLDER)
    
});

