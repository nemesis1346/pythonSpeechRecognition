import {
    GET_RECORDS_SUCCESS
} from "../constants/actions";
import { ERROR_MIDDLEWARE }
    from '../constants/errors';
import httpApi from "../api/httpApi";


export const casLogin = () => {
    return dispatch => {
        httpApi.user
            .login()
            .then(res => {
    
        

            })
            .catch(err => {
                dispatch(handleError(err.message));
            });
    };
};


const handleError = message => {
    return {
        type: ERROR_MIDDLEWARE,
        message: message
    };
};
