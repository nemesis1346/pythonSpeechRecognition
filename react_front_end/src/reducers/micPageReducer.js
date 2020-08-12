//with {} we initialize the action and state
import {
  UPLOAD_WAV_SUCCESS,
  SHOW_SPINNER,
  CONVERT_RECORD_SUCCESS,
  HIDE_SPINNER,
  BLOB_ERROR,
  GET_TRANSCRIPT_LIST,
  DELETE_RECORD_LOCALLY,
  GET_RECORD_SUCCESS,
  UPDATE_SPINNER,
  GET_LANGUAGE_LIST_SUCCESS,
  LANGUAGE_SELECTED_SUCCESS
} from "../constants/actions";
import { ERROR_MIDDLEWARE }
  from '../constants/errors';
const initState = {
  hideSpinner: true,
  transcription: "",
  transcriptionList: [],
  blobErrorList: [],
  errorServer: "",
  isRecording:false,
  languageList: [],
  language_selected:"No Language Selected"
};
const micPageReducer = (state = initState, action = {}) => {
  switch (action.type) {
    case UPLOAD_WAV_SUCCESS:
      return {
        ...state,
        errorServer: ""
      };
    case CONVERT_RECORD_SUCCESS:
      return {
        ...state,
        transcription: action.transcriptionObject.transcription,
        transcriptionList: [...state.transcriptionList, action.transcriptionObject],
        errorServer: ""
      };
      case UPDATE_SPINNER:
        return {
            ...state,
            hideSpinner: !action.isRecording,
            isRecording: action.isRecording
        };
    case GET_TRANSCRIPT_LIST:
      return {
        ...state,
        transcription: action.transcription,
        transcriptionList: [...state.transcriptionList, ...action.transcriptionList],
        errorServer: ""
      };
    case SHOW_SPINNER:
      return {
        ...state,
        hideSpinner: false
      };
    case HIDE_SPINNER:
      return {
        ...state,
        hideSpinner: true
      };
    case BLOB_ERROR:
      return {
        ...state,
        blobErrorList: [...state.blobErrorList, action.blobObject]
      };
    case GET_RECORD_SUCCESS:
      return {
        ...state,
        transcription: action.transcription,
        // hideSpinner: true,
        errorServer: ""
      };
    case ERROR_MIDDLEWARE:
      return {
        ...state,
        errorServer: action.message
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

export default micPageReducer;
