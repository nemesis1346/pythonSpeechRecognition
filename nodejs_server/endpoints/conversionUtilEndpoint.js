"use strict";
const fs = require('fs');
const databaseApi = require('../api/databaseApi');
const shell = require('shelljs');
const moment = require('moment');
const Vtt = require('vtt-creator');
const googleSpeechCron = require('../audio_processing/googleConversion');

// this method gets the duration of the subrecord wav file
async function getFileDuration(filePath, fileFolder) {
  console.log("************************************");
  console.log("getFileDuration in Conversion Util Endpoint: ");

  try {
    //then we save a list of the durations of each recording
    console.log('INFORMATION OF THE RECORDING')
    await shell.cd(fileFolder)
    const { stdout, stderr, code } = await shell.exec('sudo ffmpeg -i ' + filePath, { silent: true })

    console.log('RESULT AUDIO DURATION>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

    var duration = stderr.substring(
      stderr.lastIndexOf("Duration:") + 1,
      stderr.lastIndexOf(", bitrate")
    );
    duration = duration.replace('uration: ', '');
    console.log(duration)

    return duration;
  } catch (error) {
    console.error(error);
  }
}
module.exports.getFileDuration = getFileDuration;

// this method gets the duration of the subrecord wav file
async function updateRecordingFlag(request) {
  console.log("************************************");
  console.log("updateRecordingFlag in UploadFilesEndpoint: ");
  console.log(request)
  try {
    await databaseApi.saveRecordFlag(request.meetingId, request.isRecording)
    //save in database
    return true;
  } catch (error) {
    console.error(error);
  }
}
module.exports.updateRecordingFlag = updateRecordingFlag;


async function getSubRecordStartEndTime(uuid, startTime, duration) {
  console.log("************************************");
  console.log("computeStartEndTime in ConversionEndpoint: ");
  let timesList = []
  try {
    let startMoment;
    let endMoment;

    let currentObject = {
      uuid: uuid,
      startTime: "",
      endTime: "",
      duration: "",
      newStartTime: "",
      transcription: "",
      converted: false,
      record_id: "",
      order: "",
    }

    //we add the moments to the object
    //computation for the start moment
    startMoment = moment(startTime, "HH:mm:ss");
    currentObject.startTime = startMoment.format("HH:mm:ss").toString()
    console.log('START MOMENT')
    console.log(startMoment)

    //computation for the end moment
    endMoment = startMoment.add(duration, "HH:mm:ss");
    console.log("END MOMENT")
    console.log(endMoment)
    currentObject.endTime = endMoment.format("HH:mm:ss").toString();

    //we add the duration
    console.log('DURATION')
    console.log(duration)
    currentObject.duration = duration

    //for loop

    currentObject.newStartTime = endMoment.format("HH:mm:ss").toString();

    return currentObject;
  } catch (error) {
    console.error(error);
  }
}
module.exports.getSubRecordStartEndTime = getSubRecordStartEndTime;



async function divideFileGreaterThan1Minute(subrecord_id, folderPath) {
  console.log("************************************");
  console.log("Request divideFileGreaterThan1Minute in SpeechEndpoint: ");
  try {
    const { stdout, stderr, code } =
      await shell.exec("sudo sox " + folderPath + "/" + subrecord_id + ".wav " + subrecord_id + "_subpiece.wav trim 0 10 : newfile : restart");
    console.log(stderr)
    return true;
  } catch (error) {
    console.error(error);
  }
}
module.exports.divideFileGreaterThan1Minute = divideFileGreaterThan1Minute;


async function addAndClearTranscription(totalTranscription, newTranscription) {
  if (totalTranscription == null) {
    totalTranscription = ""
  }

  totalTranscription = totalTranscription + " " + newTranscription;
  totalTranscription = totalTranscription.replace('null', '');
  return totalTranscription;
}
module.exports.addAndClearTranscription = addAndClearTranscription;

async function createVttFileByRecordId(request, textfiles_folder) {
  console.log("************************************");
  console.log("createVttFile in ConversionEndpoint: ");
  var vttFile = new Vtt();
  let uuid = request.uuid;
  try {
    //startEndTimeList must come from the database
    let startEndTimeList = await databaseApi.getAllSubrecordsByRecordId(uuid);
    console.log('GET ALL THE RECORDS OF THIS SPEECH>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    console.log(startEndTimeList)
    //here we create a vtt file

    //we transform the string HH:mm:ss to number of seconds
    for (const subrecord of startEndTimeList) {

      console.log('RECORD CURRENT>>>>>>>>>>>>>>>>>>>')
      console.log(subrecord)

      var formatStart = subrecord.startTime.split(':'); // split it at the colons
      var formatEnd = subrecord.endTime.split(':');
      // minutes are worth 60 seconds. Hours are worth 60 minutes.
      var secondsStart = (+formatStart[0]) * 60 * 60 + (+formatStart[1]) * 60 + (+formatStart[2]);
      var secondsEnd = (+formatEnd[0]) * 60 * 60 + (+formatEnd[1]) * 60 + (+formatEnd[2]);
      console.log('Seconds Start')
      console.log(secondsStart);
      console.log('Seconds End')
      console.log(secondsEnd);

      if (secondsStart !== secondsEnd) {
        console.log('AFTER TIME VALIDATIONS')
        console.log(subrecord.transcription)
        if (subrecord.transcription != null && subrecord.transcription != "") {

          vttFile.add(secondsStart, secondsEnd, subrecord.transcription, 'align:middle line:84%');
        }
      }

    }

    console.log('THIS IS THE FINAL RESULT')
    await shell.cd(textfiles_folder);
    fs.writeFileSync('./' + uuid + '.vtt', vttFile.toString(), 'utf-8');
    console.log(vttFile.toString());
  } catch (error) {
    console.error(error);
  }
}
module.exports.createVttFileByRecordId = createVttFileByRecordId;

async function createVttFileByMeetingId(request, textfiles_folder) {
  console.log("************************************");
  console.log("createVttFileByMeetingId in ConversionEndpoint: ");
  var vttFile = new Vtt();
  let meetingId = request.meetingId;

  console.log(request)
  try {
    let recordsList = await databaseApi.getAllRecordsByMeetingId(meetingId);
    console.log('GET ALL THE RECORDS OF THIS SPEECH>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    console.log(recordsList)
    //here we create a vtt file

    //we transform the string HH:mm:ss to number of seconds
    for (const record of recordsList) {

      console.log('RECORD CURRENT>>>>>>>>>>>>>>>>>>>')
      console.log(record)

      var formatStart = record.startTime.split(':'); // split it at the colons
      var formatEnd = record.endTime.split(':');
      // minutes are worth 60 seconds. Hours are worth 60 minutes.
      var secondsStart = (+formatStart[0]) * 60 * 60 + (+formatStart[1]) * 60 + (+formatStart[2]);
      var secondsEnd = (+formatEnd[0]) * 60 * 60 + (+formatEnd[1]) * 60 + (+formatEnd[2]);
      console.log('Seconds Start')
      console.log(secondsStart);
      console.log('Seconds End')
      console.log(secondsEnd);

      if (secondsStart !== secondsEnd) {
        console.log('AFTER TIME VALIDATIONS')
        console.log(record.transcription)
        if (record.transcription != null && record.transcription != "") {

          vttFile.add(secondsStart, secondsEnd, record.transcription, 'align:middle line:84%');
        }
      }

    }

    console.log('THIS IS THE FINAL RESULT')
    await shell.cd(textfiles_folder);
    fs.writeFileSync('./' + meetingId + '.vtt', vttFile.toString(), 'utf-8');
    console.log(vttFile.toString());
  } catch (error) {
    console.error(error);
  }
}
module.exports.createVttFileByMeetingId = createVttFileByMeetingId;

async function deleteAllSubRecordsInDatabase(folderPath) {
  console.log("************************************");
  console.log("Request deleteAllSubRecordsInDatabase in SpeechEndpoint: ");
  try {

    await shell.cd(folderPath);
    const recordFolders = await fs.promises.readdir(folderPath);

    for (const recordFolderName of recordFolders) {
      let record_id = recordFolderName;
      console.log(record_id)

      const subRecordFolders = await fs.promises.readdir(folderPath + "/" + record_id);

      for (const subRecordFolderName of subRecordFolders) {
        if (subRecordFolderName.indexOf('_subpiece') > -1) {
          let subrecord_id = subRecordFolderName.replace(".wav", "");
          let filePath = folderPath + "/" + subrecord_id;

          this.deleteSubRecordInDatabase(subrecord_id)
        }
      }

    }
  } catch (error) {
    console.error(error);
  }
}
module.exports.deleteAllSubRecordsInDatabase = deleteAllSubRecordsInDatabase;

//this maybe is not necessary
async function deleteSubRecordInDatabase(recordPath) {
  console.log('DELETE RECORDS IN DATABASE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  console.log(recordPath)
  await databaseApi.deleteSubrecord(recordPath);
  console.log('RECORD DELETED');
}
module.exports.deleteSubRecordInDatabase = deleteSubRecordInDatabase;

//this maybe is not necessary
async function deleteSubRecordFiles(recordFilePath) {
  console.log('DELETE RECORDS FILE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  await shell.exec('sudo rm -rf ' + recordFilePath + "/*")
  console.log('RECORD FILES DELETED');
}
module.exports.deleteSubRecordFiles = deleteSubRecordFiles;
