import {
    GET_RECORD_SUCCESS,
    UPDATE_TRANSCRIPT_SUCCESS
} from "../constants/actions";
import { ERROR_MIDDLEWARE }
    from '../constants/errors';
import httpApi from "../api/httpApi";
import { parseResponse } from '../utils/Utils';
import { update } from "autosize";

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
                dispatch(updateTranscriptSuccess('Transcript has been updated successfully'))
            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
};


export const getRecord = uuid => {
    return dispatch => {
        httpApi.records
            .getRecord(uuid)
            .then(res => {
                let result = parseResponse(res.data.body);
                let recordObject = JSON.parse(result)
                dispatch(getRecordSuccess(recordObject))

            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
};

export const updateTranscriptSuccess = message => {
    return {
        type: UPDATE_TRANSCRIPT_SUCCESS,
        message: message
    };
};



export const getRecordSuccess = recordObject => {
    return {
        type: GET_RECORD_SUCCESS,
        recordObject: recordObject
    };
};



export const handleError = message => {
    return {
        type: ERROR_MIDDLEWARE,
        message: message
    };
};
