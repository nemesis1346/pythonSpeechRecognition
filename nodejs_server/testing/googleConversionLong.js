// Imports the Google Cloud client library
const fs = require('fs');
const speech = require('@google-cloud/speech');
const path_resolve = require('path').resolve

// Creates a client
const projectId = 'speechrecognitio-1582583203662'
const keyFilename = './speechRecognition-891688bf6447.json'
const client = new speech.SpeechClient({ projectId, keyFilename });

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
let audioAbsolutePath = path_resolve(__dirname + '/../../audio_files').toString() + '/';

const gcsUri = 'gs://speech-transcript-bucket/bvFV88s7v1DsBAo7EkyrKT_out.wav';
const filename = audioAbsolutePath + '9nPP655wgn5w7fM5XZBBsU_out.wav';
const languageCode = 'en-US';

const config = {
    languageCode: languageCode,
};

const audio = {
    uri: gcsUri,
    // content: fs.readFileSync(filename).toString('base64'),

};

const request = {
    config: config,
    audio: audio,
};

async function process() {
    //LONG OPERATION
    console.log('LONG OPERATION')
    const [operation] = await client.longRunningRecognize(request);
    console.log('PASSED OPERATION')

    // Get a Promise representation of the final result of the job
    const [response] = await operation.promise();
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    console.log(`Transcription: ${transcription}`);
}


process()