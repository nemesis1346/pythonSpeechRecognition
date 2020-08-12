//with {} we initialize the action and state
import {
    SHOW_SPINNER, HIDE_SPINNER,GET_SUBRECORDINGS_BY_ID_SUCCESS
} from "../constants/actions";
const initState = {
    hideSpinner: true,
    hideResultMessage: true,
    objects: [],

};
const transcriptSubrecordingsPageReducer = (state = initState, action = {}) => {
    switch (action.type) {
        case GET_SUBRECORDINGS_BY_ID_SUCCESS:
            return {
                ...state,
                objects: action.objects,
                hideSpinner: true,
                hideResultMessage: true
            };
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
        default:
            return state;
    }
};

export default transcriptSubrecordingsPageReducer;
