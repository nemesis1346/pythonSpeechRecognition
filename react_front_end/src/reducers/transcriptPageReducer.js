//with {} we initialize the action and state
import {
    SHOW_SPINNER,
    HIDE_SPINNER,
    GET_RECORD_SUCCESS,
    UPDATE_TRANSCRIPT_SUCCESS
} from "../constants/actions";
const initState = {
    hideSpinner: true,
    transcription: "",
    recordObject: {},
    updateTranscriptMessage:""
};
const transcriptPageReducer = (state = initState, action = {}) => {
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
        case GET_RECORD_SUCCESS:
            return {
                ...state,
                transcription: action.recordObject.transcription,
                hideSpinner: true,
                recordObject: action.recordObject,
            };
        case UPDATE_TRANSCRIPT_SUCCESS:
            return {
                ...state,
                updateTranscriptMessage: action.message,
            };
        default:
            return state;
    }
};

export default transcriptPageReducer;
