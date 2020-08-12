
'use strict';
if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: '../.env.production' }) // for other environments
} else {
    require('dotenv').config({ path: '../.env.development' })
}
const superagent = require('superagent');

const http = require('http');
const ENDPOINTS = require('../constants/server_endpoints');


var PORT = process.env.SERVER_POST;
var HOST = process.env.SERVER_HOST;
const uuid_audio_file="nhBCMadGnkb23n7JQRuBDJ"

exports.getPort = () => {
    return PORT;
}
exports.setPort = (port) => {
    PORT = port;
}

exports.convertFileByPieces = async function (folder) {
    try {
           let request={
               uuid:uuid_audio_file
           }
        await requestPost(ENDPOINTS.CONVERT_SPEECH, request, 'CONVERT SPEECH');
    } catch (error) {
        console.log('/distributionAlgorithm ERROR');
        return new Error(error);
    }
}


/**
 * This is a generic method for post request
 * @param {Its the name of the endpoint or method at the end} endpoint
 * @param {Its the data, usually should be a json object} data
 */
async function requestPost(endpoint, data, extraInfo) {
    let result;
    try {
        const res = await superagent
            .post(`${HOST}:${PORT}${endpoint}`)
            .set('Content-Type', 'application/json')
            .set('Content-Length', Buffer.byteLength(data))
            .send(data);

        result = JSON.parse(res.res.text)
        console.log('RESPONSE IN: ' + extraInfo);
        //console.log(result);
        return result;
    } catch (error) {
        console.log('THERE WAS AN ERROR IN: ' + extraInfo);
        if (error.response) {
            result = JSON.parse(error.response.res.text);
            console.error(result);
        } else {
            console.log(error);
        }
    }
    // return result;
}
/**
 * This is a generic method for get request
 * @param {Its the name of the endpoint or method at the end} endpoint
 */
async function requestGet(endpoint, extraInfo) {
    let get_options = {
        host: HOST,
        port: PORT,
        path: endpoint,
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    };

    let get_req = http.request(get_options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('RESPONSE in ' + endpoint + '------------' + extraInfo);
            let response = JSON.parse(chunk);
            let body = JSON.parse(response.body);
            console.log(body);
        });
    });
    await get_req.end()
}