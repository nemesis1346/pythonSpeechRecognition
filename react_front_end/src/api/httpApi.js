import axios from 'axios';
import * as ROUTES from '../constants/routes';
import * as ENDPOINTS from '../constants/endpoints';
const instanceDefault = axios.create({ baseURL: ROUTES.REACT_APP_SERVER_HOST }); // this is for firebase
/**
 * This File is for parsing and anything processing middleware with diferent directions
 */
export default {
    files: {
        uploadBlob: (blob, meetingId, startTime, endTime) => {
            let headersFiles = { 'Content-Type': 'multipart/form-data' }
            return instanceDefault
                .post(ENDPOINTS.ENDPOINT_UPLOAD_FILES + "?meetingId=" + meetingId + "&startTime=" + startTime + "&endTime=" + endTime, blob, { headers: headersFiles })
        },
        createVttFileByRecordId: uuid => {
            return instanceDefault.post(ENDPOINTS.ENDPOINT_CREATE_VTT_BY_RECORD_ID, { uuid });
        },
        createVttFileByMeetingId: meetingId => {
            return instanceDefault.post(ENDPOINTS.ENDPOINT_CREATE_VTT_BY_MEETING_ID, { meetingId });
        }
    },
    transcript: {
        getTranscript: uuid => {
            return instanceDefault.post(ENDPOINTS.ENDPOINT_GET_TRANSCRIPT, { uuid });
        },
        updateTranscript: object => {
            return instanceDefault.post(ENDPOINTS.ENDPOINT_UPDATE_TRANSCRIPT, { object });
        }
    },
    records: {
        streamRecord: uuid => {
            return instanceDefault.post(ENDPOINTS.ENDPOINT_STREAM_RECORD, null);
        },
        downloadRecord: uuid => {
            let headersFiles = {
                'Content-Type': "audio/wave",
                'responseType': 'blob',
                'Content-Disposition': "attachment",
            }
            return instanceDefault.get(ENDPOINTS.ENDPOINT_DOWNLOAD_RECORD + "?uuid=" + uuid, { headers: headersFiles });
        },
        getLastRecord: meetingId => {
            return instanceDefault.post(ENDPOINTS.ENDPOINT_GET_LAST_RECORD, { meetingId });
        },
        getRecords: meetingId => {
            return instanceDefault.post(ENDPOINTS.ENDPOINT_GET_RECORDS, { meetingId });
        },
        getRecordsByMeetingId: meetingId => {
            return instanceDefault.post(ENDPOINTS.ENDPOINT_GET_RECORDS_BY_MEETING_ID, { meetingId });
        },
        getRecord: uuid => {
            return instanceDefault.post(ENDPOINTS.ENDPOINT_GET_RECORD, { uuid });
        },
        getAllSubRecordingsById: uuid => {
            return instanceDefault.post(ENDPOINTS.ENDPOINT_GET_SUBRECORDS_BY_ID, { uuid });
        },
        getTranscriptListByMeetingId: request => {
            return instanceDefault.post(ENDPOINTS.ENDPOINT_GET_TRANSCRIPT_LIST_BY_MEETINGID, request);
        },
        deleteRecord: uuid => {
            return instanceDefault.post(ENDPOINTS.ENDPOINT_DELETE_RECORD, { uuid });
        },
    },
    convert: {
        convertAllRecords: () => {
            return instanceDefault.post(ENDPOINTS.ENDPOINT_CONVERT_ALL_RECORDS, null);
        },
        convertRecord: request => {
            return instanceDefault.post(ENDPOINTS.ENDPOINT_CONVERT_RECORD, request);
        },
        updateRecordingFlag: request => {
            return instanceDefault.post(ENDPOINTS.ENDPOINT_UPDATE_RECORD_FLAG, request);
        },
        getLanguageList: meetingId => {
            return instanceDefault.post(ENDPOINTS.ENDPOINT_GET_LANGUAGE_LIST, { meetingId });
        },
        select_language: request => {
            return instanceDefault.post(ENDPOINTS.ENDPOINT_SELECT_LANGUAGE, request);
        },
    },
    user: {
        login: () => {
            return instanceDefault.get(ENDPOINTS.ENDPOINT_LOGIN);
        },
    }
}
