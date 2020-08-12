//with {} we initialize the action and state
import {
    SHOW_SPINNER, HIDE_SPINNER, GET_RECORDS_SUCCESS
} from "../constants/actions";
const initState = {
    hideSpinner: true,
    hideResultMessage: true,
    objects: [],

};
const pendingRecordsConvertionPageReducer = (state = initState, action = {}) => {
    switch (action.type) {
        case HIDE_SPINNER:
            return {
                ...state,
                hideSpinner: true
            };
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
        default:
            return state;
    }
};

export default pendingRecordsConvertionPageReducer;
