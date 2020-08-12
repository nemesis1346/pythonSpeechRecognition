const { Storage } = require('@google-cloud/storage');
const bucketName = 'gs://speech-transcript-bucket';
const keyFilename = __dirname + '/speechRecognition-891688bf6447.json'
const storage = new Storage({ keyFilename: keyFilename });


async function uploadFile(filename) {
  // Uploads a local file to the bucket
  await storage.bucket(bucketName).upload(filename, {});
  console.log(`${filename} uploaded to ${bucketName}.` + ">>>>>>>>>>>>>>>>>>>>>>>>");
}

module.exports.uploadFile = uploadFile;
