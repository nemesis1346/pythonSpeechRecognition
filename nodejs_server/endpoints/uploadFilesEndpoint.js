"use strict";
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: '../.env.production' })
} else {
  require('dotenv').config({ path: '../.env.development' })
}
const DataModel = require("../models/dataModel.js");
const fs = require('fs');
const databaseApi = require('../api/databaseApi');
const short = require('short-uuid');
const translator = short(); // Defaults to flickrBase58   
const path_resolve = require('path').resolve
const wavefile = require('wavefile');
const shell = require('shelljs');
const audioAbsolutePath = path_resolve(__dirname + '/../../audio_files').toString() + '/';
const wav = new wavefile.WaveFile();
const utils = require("../utils/utils");
const momentjs = require('../utils/momentjs');
const ConversionUtilEndpoint = require('../endpoints/conversionUtilEndpoint');
const moment = require('moment');
const schedule = require('node-schedule');


//this is the main process that triggers the rest of the subprocesses.
async function saveRecordByPieces(files, meeting_id, startTime, endTime) {
  let dataModel = new DataModel(null, null, null);
  console.log("************************************");
  console.log("Request Processing Records in Upload Endpoingt: ");
  console.log('MEETING ID')
  console.log(meeting_id)
  console.log('STARTTIME')
  console.log(startTime)
  console.log('END TIME')
  console.log(endTime)
  let uuid = translator.new();
  try {
    let filenameWav = uuid + ".wav";
    let folderPath = audioAbsolutePath + uuid;
    let filepathWav = folderPath + "/" + filenameWav;

    //first we create the folder of the audios according to the uuid
    await utils.createFolder(uuid, audioAbsolutePath);

    //we first save the wav files
    await this.saveMainWavFileInDatabase(uuid, files, filepathWav, meeting_id, startTime, endTime);

    //we convert to necesary file format
    //maybe this needs to be done in the cron job
    await this.normalize(uuid, folderPath)

    //we need to save the duration here 

    // console.log('PASSED NORMALIZATION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    // //now we convert to one channel 16 bits 16000HZ sample rate
    // if (process.env.CONVERT_SILENCES === true) {
    //   //there should be a flag of silence here.
    //   await this.divideBySilence(uuid, folderPath);

    //   //create fodlers for each record
    //   await this.createSubfolder(folderPath);
    // }


    // shell.exec('cd ..')
    dataModel.status = 200;
    dataModel.data = uuid;
    dataModel.message = "Saved Successfuly";
    return dataModel;
  } catch (error) {
    console.error(error);
    dataModel.status = 300;
    dataModel.data = uuid;
    dataModel.message = "Error uploading";
    return dataModel;
  }
}
module.exports.saveRecordByPieces = saveRecordByPieces;

async function saveMainWavFileInDatabase(uuid, files, filepathWav, meeting_id, startTime, endTime) {
  wav.fromBuffer(files.wavFile.data);

  console.log("************************************");
  console.log("Request saveMainWavFileInDatabase in Upload Endpoingt: ");

  //We save the file in the specified folder
  await fs.writeFileSync(filepathWav, files.wavFile.data);

  console.log(Number(startTime))
  console.log(Number(endTime))
  //caculate time
  startTime = await utils.hhmmss(Number(startTime))
  console.log('START TIME')
  console.log(startTime)
  endTime = await utils.hhmmss(Number(endTime))
  console.log('END TIME')
  console.log(endTime)

  let speechObject = {
    uuid: uuid,
    userId: 1, //this is testing,
    converted: false,
    transcription: "",
    meeting_id: meeting_id,
    startTime: startTime,
    endTime: endTime
  };
  await databaseApi.saveRecord(speechObject);
}
module.exports.saveMainWavFileInDatabase = saveMainWavFileInDatabase;

async function normalize(uuid, folderPath) {
  await shell.cd(folderPath);
  await shell.exec('pwd')
  let resultExec = await shell.exec('sudo sox ' + uuid + '.wav -b 16 -c 1 -r 16k -t wav ' + uuid + '_out.wav')
  console.log('RESULT EXEC>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  console.log(resultExec.stdout)
}
module.exports.normalize = normalize;


async function divideBySilence(uuid, filepathWav, folderPath) {
  console.log('NORMALIZE RECORD WAV FILE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  await shell.cd(folderPath);
  await shell.exec('pwd')
  console.log('ORIGINAL AUDIO INFO>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  // await shell.exec('sudo ffmpeg -i ' + filepathWav)
  console.log('RESULT AUDIO DEVIDED>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  await shell.exec('sudo sox -V3 ' + uuid + '_out.wav ' + uuid + '_piece.wav silence 1 0.2 0.4% 1 0.2 0.4% : newfile : restart')
}
module.exports.divideBySilence = divideBySilence;

async function createSubfolder(recordfolderPath) {

  const subrecords = await fs.promises.readdir(recordfolderPath);
  console.log('SUBRECORDS PIECES')
  console.log(subrecords)
  if (subrecords.length > 0) {
    for (const piece of subrecords) {
      if (piece.indexOf('_piece') > -1) {
        let id_piece = piece.replace('.wav', '').toString();

        await utils.createFolder(id_piece, recordfolderPath);

        let subpiecesFolder = recordfolderPath + "/" + id_piece;

        await shell.cd(recordfolderPath);
        await shell.exec('sudo mv ' + piece + " " + subpiecesFolder)

      }
    }
  } else {
    return true;
  }
}
module.exports.createSubfolder = createSubfolder;
