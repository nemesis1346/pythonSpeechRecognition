import {
    GET_RECORDS_SUCCESS,
    GET_RECORD_SUCCESS,
    GET_LAST_RECORD_SUCCESS,
    DELETE_RECORD_LOCALLY
} from "../constants/actions";
import { ERROR_MIDDLEWARE }
    from '../constants/errors';
import httpApi from "../api/httpApi";
import { parseResponse } from '../utils/Utils';
import moment from 'moment';
import download from 'js-file-download';
import { getTranscriptListByMeetingId } from '../actions/roomTranscriptActions';


export const updateTranscript = object => {
    return dispatch => {
        httpApi.transcript
            .updateTranscript(object)
            .then(res => {
                console.log('RESPONSE UPDATE TRANSCRIPT')
                let result = parseResponse(res.data.body);
                let parsedResponse = JSON.parse(result);
                console.log(parsedResponse)

                dispatch(getRecord(object.uuid))

            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
};


export const getAllRecordsConverted = (meetingId) => {
    console.log('REQUEST GET RECORDS BY MEETING ID')
    console.log(meetingId)
    return dispatch => {
        httpApi.records
            .getRecordsByMeetingId(meetingId)
            .then(res => {
                console.log(res)

                let result = parseResponse(res.data.body);
                result = result.filter(element => element.converted == true);

                result.forEach(element => {
                    let momentObject = moment(new Date(element.createdAt)).local().format("YYYY-MM-DD HH:mm")
                    let momentObjectUpdatedAt = moment(new Date(element.updatedAt)).local().format("YYYY-MM-DD HH:mm")
                    element.createdAt = momentObject
                    element.updatedAt = momentObjectUpdatedAt
                });
                dispatch(getRecordsSuccess(result))

            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
};

export const getLastRecord = (meetingId) => {
    return dispatch => {
        httpApi.records
            .getLastRecord(meetingId)
            .then(res => {
                let result = parseResponse(res.data.body);
                let speechObject = JSON.parse(result)
                dispatch(getLastRecordSuccess(speechObject))

            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
}


export const getRecord = uuid => {
    return dispatch => {
        httpApi.records
            .getRecord(uuid)
            .then(res => {
                console.log('GET RECORD RESPONSE')
                let result = parseResponse(res.data.body);
                console.log(result)
                let recordObject = JSON.parse(result)
                dispatch(getRecordSuccess(recordObject))

            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
};

export const deleteRecordRoom = (uuid) => {
    return dispatch => {
        httpApi.records
            .deleteRecord(uuid)
            .then(res => {
                let result = parseResponse(res.data.body);
                dispatch(deleteRecordLocally(uuid))
            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
};

export const deleteRecord = (uuid, meetingId) => {
    return dispatch => {
        httpApi.records
            .deleteRecord(uuid)
            .then(res => {
                let result = parseResponse(res.data.body);
                dispatch(getAllRecordsConverted(meetingId))
            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
};

export const streamRecord = uuid => {
    return dispatch => {
        httpApi.records
            .streamRecord(uuid)
            .then(res => {
                let result = parseResponse(res.data.body);

            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
};

export const downloadRecord = uuid => {
    return dispatch => {
        httpApi.records
            .downloadRecord(uuid)
            .then(res => {
                console.log('RESULT ACTIONS DOWNLOAD')
                console.log(res)
                download(res.data, 'test.wav');

                let result = parseResponse(res.data.body);

            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
};



const getRecordSuccess = recordObject => {
    return {
        type: GET_RECORD_SUCCESS,
        transcription: recordObject.transcription,
        recordObject: recordObject
    };
};
const deleteRecordLocally = uuid => {
    return {
        type: DELETE_RECORD_LOCALLY,
        uuid: uuid
    };
};

const getLastRecordSuccess = lastRecord => {
    return {
        type: GET_LAST_RECORD_SUCCESS,
        lastRecord: lastRecord
    };
};
const getRecordsSuccess = objects => {
    return {
        type: GET_RECORDS_SUCCESS,
        objects: objects
    };
};



const handleError = message => {
    return {
        type: ERROR_MIDDLEWARE,
        message: message
    };
};
