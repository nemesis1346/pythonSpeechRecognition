//with {} we initialize the action and state
import {
    SHOW_SPINNER,
    GET_RECORDS_SUCCESS,
    GET_RECORD_SUCCESS,
    GET_LAST_RECORD_SUCCESS
} from "../constants/actions";
const initState = {
    hideSpinner: true,
    objects: [],
    hideResultMessage: true,
    transcription: ""
};
const recordListPageReducer = (state = initState, action = {}) => {
    switch (action.type) {
        case SHOW_SPINNER:
            return {
                ...state,
                hideSpinner: false
            };
        case GET_RECORDS_SUCCESS:
            return {
                ...state,
                objects: action.objects,
                hideSpinner: true,
                hideResultMessage: true
            };
        case GET_RECORD_SUCCESS:
            return {
                ...state,
                transcription: action.transcription,
                hideSpinner: true,
            };
        case GET_LAST_RECORD_SUCCESS:
            return {
                ...state,
                transcription: action.lastRecord,
                hideSpinner: true,
            };
        default:
            return state;
    }
};

export default recordListPageReducer;
