import {
    GET_SUBRECORDINGS_BY_ID_SUCCESS,
} from "../constants/actions";
import { ERROR_MIDDLEWARE }
    from '../constants/errors';
import httpApi from "../api/httpApi";
import { parseResponse } from '../utils/Utils';

export const getAllSubRecordingsById = uuid => {
    return dispatch => {
        httpApi.records
            .getAllSubRecordingsById(uuid)
            .then(res => {
                let result = parseResponse(res.data.body);
                dispatch(getRecordingsSuccess(result))

            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
};


const getRecordingsSuccess = objects => {
    return {
        type: GET_SUBRECORDINGS_BY_ID_SUCCESS,
        objects: objects
    };
};



const handleError = message => {
    return {
        type: ERROR_MIDDLEWARE,
        message: message
    };
};
