import { combineReducers } from 'redux';
import micPageReducer from './micPageReducer';
import recordListPageReducer from './recordListPageReducer';
import pendingRecordsConvertionPageReducer from './pendingRecordsConvertionPageReducer';
import roomTranscriptionPageReducer from './roomTranscriptionPageReducer';
import transcriptPageReducer from './transcriptPageReducer';
import transcriptSubrecordingsPageReducer from './transcriptSubrecordingsPageReducer';
//This is for comining all different reducers
export default combineReducers({
    micPageReducer,
    recordListPageReducer,
    pendingRecordsConvertionPageReducer,
    roomTranscriptionPageReducer,
    transcriptPageReducer,
    transcriptSubrecordingsPageReducer
});