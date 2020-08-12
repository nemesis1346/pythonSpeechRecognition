require('../api/connection');
const shell = require('shelljs');
const DatabaseApi = require('../api/databaseApi');
const path_resolve = require('path').resolve
const GoogleSpeechCron = require('./googleConversionCron');
const fs = require('fs');

//THIS IS AN OLD VERSION
class ConvertSpeechCron {
    constructor() {
        this.databaseApi = new DatabaseApi();
        this.googleSpeechCron = new GoogleSpeechCron();
    }

    init() {
    }

    async convertFileByPieces(uuid) {
        let audioAbsolutePath = path_resolve(__dirname + '/../../audio_files').toString() + '/';
        try {
            let transcription = '';

            shell.cd(audioAbsolutePath);
            //try the conversion
            console.log("################# PROCESS STARTED ########################")
            //now we have to update the record of the main speech
            let mainSpeech = await this.databaseApi.getSpeech(uuid);
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MAIN SPEECH@@@@@@@>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            console.log(mainSpeech)
            if (mainSpeech && mainSpeech != null && mainSpeech.converted == false) {
                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>INITIATE PROCESS MAIN SPEECH CONVERSION>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')


                const dividedFiles = await fs.promises.readdir(audioAbsolutePath + uuid);
                console.log('DEVIDED PIECES')
                console.log(dividedFiles)

                //here we are saving the individual recorded pieces of the speech object
                for (const piece of dividedFiles) {
                    if (piece.indexOf('_piece') > -1) {

                        let transcriptionPiece = await this.googleSpeechCron.processShort(audioAbsolutePath + uuid + '/' + piece);
                        let id_piece = piece.replace('.wav', '').toString();
                        console.log('TRANSCRIPTION RESULT');
                        console.log(transcriptionPiece)
                        console.log('PIECE NAME');
                        console.log(id_piece);

                        // //NOW WE UPDATE THE DATABASE 
                        await this.databaseApi.updateObjectProperty('Record', id_piece, 'converted', true);
                        await this.databaseApi.updateObjectProperty('Record', id_piece, 'transcription', transcriptionPiece.toString());

                        //now we have to update the record of the main speech
                        let currentMainSpeechObject = await this.databaseApi.getSpeech(uuid);

                        let currentMainSpeechTranscription = currentMainSpeechObject.transcription;
                        console.log('CURENT TRANSCRIPTION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                        console.log(currentMainSpeechTranscription)

                        let currentTranscriptionPiece;
                        if (transcriptionPiece == null) {
                            currentTranscriptionPiece = ""
                        } else {
                            currentTranscriptionPiece = transcriptionPiece;
                        }

                        currentMainSpeechTranscription = currentMainSpeechTranscription + " " + currentTranscriptionPiece;
                        currentMainSpeechTranscription = currentMainSpeechTranscription.replace('null', '');
                        transcription = currentMainSpeechTranscription;
                        await this.databaseApi.updateObjectProperty('Speech', uuid, 'transcription', currentMainSpeechTranscription);
                    }

                }
                //now we have to update the record of the main speech,converted to tru
                await this.databaseApi.updateObjectProperty('Speech', uuid, 'converted', true);

            }

            console.log('FINISHED PROCESS BY PIECES CONVERTION>>>>>>>>')
            return transcription;

        } catch (err) {
            console.log('ERROR>>>>>>')
            console.log(err)
            shell.cd('../audio_files');

        }
    }

    async convertAllFilesGoogle() {
        let audioAbsolutePath = path_resolve(__dirname + '/../../audio_files').toString() + '/';
        //try the conversion
        try {
            console.log("*********************CONVERT ALL FILES PROCESSING STARTED****************************")
            let transcriptions = [];
            shell.cd(audioAbsolutePath);
            shell.exec('pwd');
            // Get the files as an array
            const folders = await fs.promises.readdir(audioAbsolutePath);

            // Loop them all with the new for...of
            for (const folder of folders) {

                let uuid = folder;
                //evaluation of main speech

                //now we have to update the record of the main speech
                let mainSpeech = await this.databaseApi.getSpeech(uuid);
                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MAIN SPEECH@@@@@@@>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                console.log(mainSpeech)
                if (mainSpeech && mainSpeech != null && mainSpeech.converted == false) {
                    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>INITIATE PROCESS MAIN SPEECH CONVERSION>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')


                    const dividedFiles = await fs.promises.readdir(audioAbsolutePath + uuid);
                    console.log('DEVIDED PIECES')
                    console.log(dividedFiles)
                    console.log(audioAbsolutePath + uuid)

                    //here we are saving the individual recorded pieces of the speech object
                    for (const piece of dividedFiles) {
                        console.log("*********************NEW DEVIDED PIECE****************************")

                        if (piece.indexOf('_piece') > -1) {

                            let transcriptionPiece = await this.googleSpeechCron.processShort(audioAbsolutePath + uuid + '/' + piece);
                            let id_piece = piece.replace('.wav', '').toString();
                            console.log('TRANSCRIPTION RESULT');
                            console.log(transcriptionPiece)
                            console.log('PIECE NAME');
                            console.log(id_piece);

                            // //NOW WE UPDATE THE DATABASE 
                            await this.databaseApi.updateObjectProperty('Record', id_piece, 'converted', true);
                            await this.databaseApi.updateObjectProperty('Record', id_piece, 'transcription', transcriptionPiece.toString());

                            let currentMainSpeechObject = await this.databaseApi.getSpeech(uuid);

                            let currentMainSpeechTranscription = currentMainSpeechObject.transcription;
                            console.log('CURENT TRANSCRIPTION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                            console.log(currentMainSpeechTranscription)

                            let currentTranscriptionPiece;
                            if (transcriptionPiece == null) {
                                currentTranscriptionPiece = ""
                                //here we must to delete the record
                            } else {
                                currentTranscriptionPiece = transcriptionPiece;
                            }

                            currentMainSpeechTranscription = currentMainSpeechTranscription + " " + currentTranscriptionPiece;
                            currentMainSpeechTranscription = currentMainSpeechTranscription.replace('null', '');
                            transcriptions.push(currentMainSpeechTranscription)
                            await this.databaseApi.updateObjectProperty('Speech', uuid, 'transcription', currentMainSpeechTranscription);

                        }
                    }
                    //now we have to update the record of the main speech,converted to tru
                    await this.databaseApi.updateObjectProperty('Speech', uuid, 'converted', true);

                }

            }
            console.log('FINISHED PROCESS BY PIECES CONVERTION>>>>>>>>')

            return transcriptions;
        } catch (err) {
            console.log('ERROR>>>>>>')
            console.log(err)
            shell.cd('../audio_files');

        }

    }
}
module.exports = ConvertSpeechCron;

