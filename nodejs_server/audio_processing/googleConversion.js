// Imports the Google Cloud client library
const fs = require('fs');
const speech = require('@google-cloud/speech');
const projectId = 'speechrecognitio-1582583203662'
const keyFilename = __dirname + '/speechRecognition-891688bf6447.json'

async function processLong(uuid) {
    try {
        // Creates a client
        const gcsUri = 'gs://speech-transcript-bucket/' + uuid + '_out.wav';

        const client = await new speech.SpeechClient({ projectId, keyFilename });
        const languageCode = 'en-US';

        const config = {
            languageCode: languageCode,
        };
        const audio = {
            uri: gcsUri,
        };

        const request = {
            config: config,
            audio: audio,
        };

        // LONG AUDIO 
        // Detects speech in the audio file. This creates a recognition job that you
        // can wait for now, or get its result later.
        console.log('LONG OPERATION')
        const [operation] = await client.longRunningRecognize(request);
        console.log('PASSED OPERATION')

        // Get a Promise representation of the final result of the job
        const [response] = await operation.promise();
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        console.log(`Transcription: ${transcription}`);
        return transcription;
    } catch (err) {
        console.log('ERROR>>>>>>')
        console.log(err)
    }

}
module.exports.processLong = processLong;

async function processShort(filename) {
    console.log('STARTING PROCESS AUDIO SHORT')
    console.log('FILENAME:')
    console.log(filename)
    try {
        // const filename = audioAbsolutePath + uuid+'9nPP655wgn5w7fM5XZBBsU_out.wav';

        // Creates a client
        const client = await new speech.SpeechClient({ projectId, keyFilename });
        const languageCode = 'en-US';

        const config = {
            languageCode: languageCode,
        };
        const audio = {
            content: fs.readFileSync(filename).toString('base64'),
        };

        const request = {
            config: config,
            audio: audio,
        };

        // Detects speech in the audio file SHORT AUDIO FILE
        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        console.log(`Transcription: `, transcription);
        return transcription;
    } catch (err) {
        console.log('ERROR>>>>>>')
        console.log(err)
    }
}
module.exports.processShort = processShort;
