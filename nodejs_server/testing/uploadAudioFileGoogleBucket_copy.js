const {Storage} = require('@google-cloud/storage');
const path_resolve = require('path').resolve

//-
// Upload a file from a local path.
//-
const audioAbsolutePath = path_resolve(__dirname + '/../../audio_files').toString() + '/';
const filename = audioAbsolutePath + '9nPP655wgn5w7fM5XZBBsU_out.wav';
const bucketName = 'gs://speech-transcript-bucket';
const keyFilename = __dirname + '/speechRecognition-891688bf6447.json'

const storage = new Storage({keyFilename: keyFilename});


// bucket.upload(filename, function(err, file, apiResponse) {
//   // Your bucket now contains:
//   // - "image.png" (with the contents of `/local/path/image.png')

//   // `file` is an instance of a File object that refers to your new file.
// });


async function uploadFile() {
  // Uploads a local file to the bucket
  await storage.bucket(bucketName).upload(filename, {
  });

  console.log(`${filename} uploaded to ${bucketName}.`+">>>>>>>>>>>>>>>>>>>>>>>>");
}

uploadFile().catch(console.error);