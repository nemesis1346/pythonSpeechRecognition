'use strict';
//Imports
if (process.env.NODE_ENV === 'production') {
    console.log('IS ENV PRODUCTION')
    require('dotenv').config({ path: '../.env.production' }) // for other environments
} else {
    console.log('IS ENV DEVELOPMENT')
    require('dotenv').config({ path: '../.env.development' })
}
//Imports common with child process
const sequelizedb = require('../api/connection');
const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { fork } = require('child_process');
const app = express();
const port = process.env.SERVER_PORT;
const host = process.env.SERVER_HOST;
const UploadFilesEndpoint = require("../endpoints/uploadFilesEndpoint.js");
const SessionEndpoint = require('../endpoints/sessionEndpoint');
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



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/// ALL OF THE FOLLOWING IS FOR CAS AUTHENTICATION AND SESSION>>>>>>>>>>>>>>>>>>>>>>>>>
const CASAuthentication = require('cas-authentication');
const expressSession = require('express-session');
const SessionStore = require('express-session-sequelize')(expressSession.Store);


var Session = sequelizedb.define("Session", {
  sid: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  userId: Sequelize.STRING,
  expires: Sequelize.DATE,
  data: Sequelize.STRING(50000),
});

function extendDefaultFields(defaults, session) {
  return {
    data: defaults.data,
    expires: defaults.expires,
    userId: session.userId,
  };
}


//we call the database connection and connect the store
const sequelizeSessionStore = new SessionStore({
  db: sequelizedb,
  table: "Session",
  extendDefaultFields: extendDefaultFields,
});

// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
  cas_url: process.env.CAS_URL,
  service_url: process.env.CAS_SERVICE,
  cas_version: '3.0',
  renew: false,
  is_dev_mode: false,
  dev_mode_user: '',
  dev_mode_info: {},
  session_name: 'cas_user',
  session_info: 'cas_userinfo',
  destroy_session: false
});
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


const handler = async (request, response) => {
    const { headers, method, url } = request;
    let buffer = [];
    request.on('error', (err) => {
        console.log("Error", err);
    }).on('data', (chunk) => {
        buffer.push(chunk);
    }).on('end', async () => {
        let bufferContent = Buffer.concat(buffer).toString();
        console.log(bufferContent);

        //Set response
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader(
            "Access-Control-Allow-Methods",
            "GET,PUT,POST,DELETE,OPTIONS"
        );
        response.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization, Content-Length, X-Requested-With"
        );
        response.on("error", err => {
            console.error(err);
        });

        await fork('./handlerProcess.js', ['message'], { encoding: 'utf8' })
            .on("message", (body) => {
                console.log('On Message');
                console.log(body);
                const responseBody = { headers, method, url, body };
                response.statusCode = 200;
                response.write(JSON.stringify(responseBody));
                response.end();
            })
            .on('error', (error) => {
                console.log('On Error');
                console.log(error);
                const responseBody = { headers, method, url, error };
                response.statusCode = 300;
                response.write(JSON.stringify(responseBody));
                response.end();
            })
            .send({ data: JSON.stringify(bufferContent), url: url });
    });
}




const downloadRecordHandler = async (request, response) => {
    let dataModel = new DataModel(null, null, null);
    const { headers, method, url } = request;
  
    let uuid = ""
    console.log('REQUEST DOWNLOAD HANDLER')
    // console.log(request)
    if (url_parse(url, true).query != null) {
      uuid = url_parse(url, true).query.uuid;
    } else {
      uuid = 'undefined'
    }
    console.log('UUID')
    console.log(uuid)
    let filePath = FOLDER_DIRECTORIES.AUDIO_FOLDER + "/" + uuid + '/' + uuid + ".wav"
    const file = fs.createWriteStream(filePath);
    try {
  
      console.log(filePath)
      // console.log(file)
      response.download(filePath, function (err) {
        console.log('ERROR IN DOWNLOADING ')
        console.log(err);
  
      });
      // file.on('finish', function () {
      //   file.close(cb);  // close() is async, call cb after close completes.
      // });
    } catch (err) {
      // fs.unlink(filePath); // Delete the file async. (But we don't check the result)
  
      dataModel.message = err.message.toString();
      dataModel.status = "500";
      let body = JSON.stringify(dataModel);
      console.log("ERROR 500:");
      console.log(err);
      const responseBody = { headers, method, url, body };
  
      response.statusCode = 500;
      response.write(JSON.stringify(responseBody));
      response.end();
    }
  };
  
  
  const handlerFiles = async (request, response) => {
    let dataModel = new DataModel(null, null, null);
    const { headers, method, url } = request;
  
    try {
      let meetingId = ""
      let startTime = "";
      let endTime = "";
      if (url_parse(url, true).query != null) {
        meetingId = url_parse(url, true).query.meetingId;
        startTime = url_parse(url, true).query.startTime;
        endTime = url_parse(url, true).query.endTime;
      } else {
        meetingId = ENDPOINTS.ADMIN_NAME
      }
      let files = request.files;
      let result = await this.uploadFilesEndpoint.saveRecordByPieces(files, meetingId, startTime, endTime);
      let body = JSON.stringify(result);
  
      console.log("STATUS 200: ");
      // console.log(body);
      const responseBody = { headers, method, url, body };
  
      response.statusCode = 200;
      response.write(JSON.stringify(responseBody));
      response.end();
    } catch (err) {
      dataModel.message = err.message.toString();
      dataModel.status = "500";
      let body = JSON.stringify(dataModel);
      console.log("ERROR 500:");
      console.log(err);
      const responseBody = { headers, method, url, body };
  
      response.statusCode = 500;
      response.write(JSON.stringify(responseBody));
      response.end();
    }
  };
  

// EXPRESS SESSION SETUP
// Set up an Express session, which is required for CASAuthentication.
// Resources used: 
// https://blog.jscrambler.com/best-practices-for-secure-session-management-in-node/
// https://codeforgeek.com/manage-session-using-node-js-express-4/
// https://expressjs.com/en/resources/middleware/session.html
// https://www.youtube.com/watch?v=hKYjSgyCd60
app.use(cookieParser());
app.set('trust proxy', 1) // trust first proxy
app.use(expressSession({
    secret: 'nobleprogkey',
    name: 'nobleprog', //this is the name of the cookie
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }, //being true, it requires https connections
    store: sequelizeSessionStore
},
));
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

app.post(ENDPOINTS.GET_RECORDS, handler);
app.post(ENDPOINTS.GET_RECORD, handler);
app.post(ENDPOINTS.GET_LAST_RECORD, handler)
app.post(ENDPOINTS.STREAM_RECORD, handler);
app.post(ENDPOINTS.CONVERT_RECORD, handler);
app.post(ENDPOINTS.CONVERT_ALL_RECORDS, handler);
app.post(ENDPOINTS.UPDATE_TRANSCRIPT, handler);
app.post(ENDPOINTS.GET_SUB_RECORDINGS_BY_ID, handler);
app.post(ENDPOINTS.CREATE_VTT_FILE_BY_RECORD_ID, handler);
app.post(ENDPOINTS.CREATE_VTT_FILE_BY_MEETING_ID, handler);
app.post(ENDPOINTS.VERIFY_SERVER, handler)
app.post(ENDPOINTS.GET_TRANSCRIPTLIST_BY_MEETINGID, handler)


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());
app.get(ENDPOINTS.DOWNLOAD_RECORD, downloadRecordHandler);
app.post(ENDPOINTS.UPLOAD_FILES, handlerFiles);

//>>>>>>>>>CAS ROUTES, THEY INTERACT WITH THE SESSION>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.get('/login', cas.bounce, function (req, res) {
    console.log('login endpoint>>>>>>>>>>>>>>')
    console.log(res)
    res.send('<html><body>Hello!</body></html>');
});
// app.get('/login', cas.bounce_redirect);
// An example of accessing the CAS user session variable. This could be used to
// retrieve your own local user records based on authenticated CAS username.
app.get('/api/user', cas.block, function (req, res) {
    res.json({ cas_user: req.session[cas.session_name] });
});

// Unauthenticated clients will be redirected to the CAS login and then to the
// provided "redirectTo" query parameter once authenticated.
app.get('/authenticate', cas.bounce_redirect);

// This route will de-authenticate the client with the Express server and then
// redirect the client to the CAS logout page.
app.get('/logout', cas.logout);
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


// SERVING
console.log('PORT:' + port)
console.log('HOST:' + host)
app.listen(port, host, async err => {
    if (err) {
        return console.log("something bad happened", err);
    }
    try {
        //Instance of the network and transactions
        this.uploadFilesEndpoint = new UploadFilesEndpoint();
        this.sessionEndpoint = new SessionEndpoint();
      } catch (error) {
        console.log("Error Composer instance: ", error);
      }
    console.log("server is listening on: ", port);
});

io.on("connection", function (socket) {
    console.log("A new socket has joined: " + socket.id);

    socket.on("hello", function (data) {
        console.log(data);
    });
});