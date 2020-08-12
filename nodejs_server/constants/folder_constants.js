"use strict";

const path_resolve = require('path').resolve

module.exports = {
    AUDIO_FOLDER: path_resolve(__dirname + "/../../audio_files").toString(),
    TEXT_FOLDER: path_resolve(__dirname + "/../../text_files").toString()
}