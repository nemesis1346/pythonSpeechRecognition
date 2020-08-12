if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: '../.env.production' }) // for other environments
} else {
    require('dotenv').config({ path: '../.env.development' })
}

module.exports = {
    GET_RECORDS: "/backend/getRecords",
    GET_RECORD: '/backend/getRecord',
    STREAM_RECORD: '/backend/streamRecord',
    CONVERT_RECORD: '/backend/convertRecord',
    CONVERT_ALL_RECORDS: '/backend/convertAllRecords',
    UPLOAD_FILES: "/backend/uploadFiles",
    GET_LAST_RECORD: "/backend/getLastRecord",
    UPDATE_TRANSCRIPT: "/backend/updateTranscript",
    GET_SUB_RECORDINGS_BY_ID: "/backend/getSubRecordsById",
    CREATE_VTT_FILE_BY_RECORD_ID: "/backend/createVttFileByRecordId",
    CREATE_VTT_FILE_BY_MEETING_ID:"/backend/createVttFileByMeetingId",
    DOWNLOAD_RECORD: "/backend/downloadRecord",
    GET_TRANSCRIPTLIST_BY_MEETINGID:"/backend/getTranscriptListByMeetingId",
    VERIFY_SERVER: "/backend/verifyServer", //this sets up the meeting id and the user id
    FRONT_END_FOLDER_PATH: __dirname + process.env.FRONT_END_FOLDER_PATH,
    ADMIN_NAME:"NEW_ADMIN",
    DELETE_RECORD:"/backend/deleteRecord",
    GET_RECORDS_BY_MEETING_ID: "/backend/getRecordsByMeetingId",
    UPDATE_RECORD_FLAG: "/backend/updateRecordingFlag",
    GET_LANGUAGE_LIST:"/backend/getLanguageList",
    SELECT_LANGUAGE:"/backend/select_language"
}