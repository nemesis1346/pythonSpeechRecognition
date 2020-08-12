import {
    CONVERT_ALL_SUCCESS, GET_SPEECHES_SUCCESS,SHOW_SPINNER
} from "../constants/actions";
import { ERROR_MIDDLEWARE }
    from '../constants/errors';
import httpApi from "../api/httpApi";
import { parseResponse } from '../utils/Utils';
import { uploadBlobSuccess } from './micPageActions';
import moment from 'moment';

export const convertAllSpeeches = () => {
    return dispatch => {
        httpApi
            .convert
            .convertAllSpeeches()
            .then(res => {
                let result = parseResponse(res.data.body);
                // dispatch(onConvertAllSuccess(result))
                dispatch(getAllSpeechesNotConverted('userId'))

            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
};

export const convertSpeechPendingList = (uuid) => {
    return dispatch => {
        httpApi
            .convert
            .convertSpeech(uuid)
            .then(res => {
                let message = JSON.parse(res.data.body).message;
                dispatch(uploadBlobSuccess(message))
                dispatch(getAllSpeechesNotConverted('userId'))

            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
};

export const getAllSpeechesNotConverted = userId => {
    return dispatch => {
        httpApi.transcript
            .getSpeeches('userId')
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
                dispatch(getSpeechesSuccess(result))

            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
};

export const getSpeechesSuccess = objects => {
    return {
        type: GET_SPEECHES_SUCCESS,
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
export const onConvertAllSuccess = () => {
    return {
        type: CONVERT_ALL_SUCCESS,
    };
};

