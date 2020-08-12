//with {} we initialize the action and state
import {
    SHOW_SPINNER,
    HIDE_SPINNER,
    GET_LAST_RECORD_SUCCESS,
    GET_RECORD_SUCCESS,
    CONVERT_RECORD_SUCCESS_ROOM,
    IS_CRONJOB_RUNNING,
    GET_TRANSCRIPT_LIST,
    DELETE_RECORD_LOCALLY,
    UPDATE_SPINNER,
    UPDATE_TRANSCRIPT_SUCCESS,
    GET_LANGUAGE_LIST_SUCCESS,
    LANGUAGE_SELECTED_SUCCESS
} from "../constants/actions";
import { ERROR_MIDDLEWARE }
    from '../constants/errors';
const initState = {
    hideSpinner: true,
    transcription: "",
    transcriptionList: [],
    errorServer: "",
    isRecording: false,
    languageList: [],
    language_selected:"No Language Selected"
};
const roomTranscriptionPageReducer = (state = initState, action = {}) => {
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
        case UPDATE_SPINNER:
            return {
                ...state,
                hideSpinner: !action.isRecording,
                isRecording: action.isRecording
            };
        case IS_CRONJOB_RUNNING:
            if (action.isCronRunning) {
                return {
                    ...state,
                    errorServer: ""
                };
            } else {
                return {
                    ...state,
                    errorServer: "Transcription Job is Down Error"
                };
            }
        case GET_LAST_RECORD_SUCCESS:
            return {
                ...state,
                transcription: action.lastRecord.transcription,
                uuid: action.lastRecord.uuid,
                hideSpinner: true,
                errorServer: ""
            };
        case GET_TRANSCRIPT_LIST:
            return {
                ...state,
                transcription: action.transcription,
                transcriptionList: [...state.transcriptionList, ...action.transcriptionList],
                errorServer: ""

            };
        case DELETE_RECORD_LOCALLY:
            let newArr = [...state.transcriptionList.filter((elem, idx) => { // [1,2,3,5]
                return elem.uuid !== action.uuid
            })];
            return {
                ...state,
                transcription: action.transcription,
                transcriptionList: newArr
            };
        case GET_RECORD_SUCCESS:
            return {
                ...state,
                transcription: action.transcription,
                errorServer: ""
            };
        case ERROR_MIDDLEWARE:
            return {
                ...state,
                errorServer: action.message,
                hideSpinner: true,
            };
        case UPDATE_TRANSCRIPT_SUCCESS:
            return {
                ...state,
                updateTranscriptMessage: action.message,
            };
        case GET_LANGUAGE_LIST_SUCCESS:
            return {
                ...state,
                languageList: [...state.languageList, ...action.languageList],
            };
        case LANGUAGE_SELECTED_SUCCESS:
            return {
                ...state,
                language_selected: action.language_selected
            };
        default:
            return state;
    }
};

export default roomTranscriptionPageReducer;