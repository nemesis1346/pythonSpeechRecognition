import {
    CONVERT_ALL_RECORDS_SUCCESS, GET_RECORDS_SUCCESS, SHOW_SPINNER
} from "../constants/actions";
import { ERROR_MIDDLEWARE }
    from '../constants/errors';
import httpApi from "../api/httpApi";
import { parseResponse } from '../utils/Utils';
import { uploadBlobSuccess } from './micPageActions';
import moment from 'moment';

export const convertAllRecords = () => {
    return dispatch => {
        httpApi
            .convert
            .convertAllRecords()
            .then(res => {
                let result = parseResponse(res.data.body);
                // dispatch(onConvertAllSuccess(result))
                dispatch(getAllRecordsNotConverted('userId'))

            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
};

export const convertRecordsPendingList = (uuid, meetingId) => {
    console.log('REQUEST CONVERT REQUEST')
    console.log(uuid)
    console.log(meetingId)
    let request = {
        uuid: uuid,
        meetingId: meetingId
    }
    return dispatch => {
        httpApi
            .convert
            .convertRecord(request)
            .then(res => {
                let message = JSON.parse(res.data.body).message;
                dispatch(uploadBlobSuccess(message))
                dispatch(getAllRecordsNotConverted('userId'))

            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
};

export const getAllRecordsNotConverted = userId => {

    return dispatch => {
        httpApi.records
            .getRecords('userId')
            .then(res => {
                let result = parseResponse(res.data.body);
                result = result.filter(element => element.converted == false);
                //THis is for transforminf the date
                result.forEach(element => {
                    let momentObjectCreatedAt = moment(new Date(element.createdAt)).local().format("YYYY-MM-DD HH:mm")
                    let momentObjectUpdatedAt = moment(new Date(element.updatedAt)).local().format("YYYY-MM-DD HH:mm")
                    element.createdAt = momentObjectCreatedAt
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

export const getRecordsSuccess = objects => {
    return {
        type: GET_RECORDS_SUCCESS,
        objects: objects
    };
};



export const handleError = message => {
    return {
        type: ERROR_MIDDLEWARE,
        message: message
    };
};

export const showSpinner = () => {
    return {
        type: SHOW_SPINNER,
    };
};
export const onConvertAllRecordsSuccess = () => {
    return {
        type: CONVERT_ALL_RECORDS_SUCCESS,
    };
};

