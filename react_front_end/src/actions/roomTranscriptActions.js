import {
    GET_TRANSCRIPT_LIST,
    UPDATE_SPINNER,
    SHOW_SPINNER,
    HIDE_SPINNER,
    IS_CRONJOB_RUNNING,
    GET_RECORD_SUCCESS,
    UPDATE_TRANSCRIPT_SUCCESS,
    GET_LANGUAGE_LIST_SUCCESS,
    LANGUAGE_SELECTED_SUCCESS
} from "../constants/actions";
import { ERROR_MIDDLEWARE }
    from '../constants/errors';
import httpApi from "../api/httpApi";
import { parseResponse, clearListFromEmptyStrings } from '../utils/Utils';
import moment from 'moment';


//this is the entire latest transcrption list
export const getTranscriptListByMeetingId = (meetingId, pullDate) => {
    let request = {
        meetingId: meetingId,
        pullDate: pullDate
    }

    return dispatch => {
        httpApi.records
            .getTranscriptListByMeetingId(request)
            .then(res => {
                // console.log(res)

                let result = JSON.parse(parseResponse(res.data.body));
                // console.log('RESULT TRANSCRIPTION LIST WITH MEETING ID')
                // console.log(result)
                let listResult = result.transcriptionList
                listResult = listResult.filter(element => element.converted == true);

                dispatch(getTranscriptListSuccess(listResult))
                dispatch(updateSpinnerAction(result.isRecording))
                dispatch(updateTranscriptionJobRunning(result.isCronRunning))
                dispatch(languageSelectedSuccess(result.language_selected))

            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
}
export const select_language = (language_selected, meetingId, language_description) => {
    let request = {
        language_selected: language_selected,
        meetingId: meetingId
    }
    return dispatch => {
        httpApi.convert
            .select_language(request)
            .then(res => {
                console.log(res)

                let result = JSON.parse(parseResponse(res.data.body));
                // console.log('RESULT SELECT LANGUAGE WITH MEETING ID')
                // console.log(language_description)
                dispatch(languageSelectedSuccess(language_description))
            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
}

export const getLanguageList = (meetingId) => {
    return dispatch => {
        httpApi.convert
            .getLanguageList(meetingId)
            .then(res => {
                // console.log('RESULT GET LANGUAGE LIST WITH MEETING ID')
                // console.log(JSON.parse(parseResponse(res.data.body)))
                let result = JSON.parse(parseResponse(res.data.body));
                // console.log(result)
                if (result.language_selected != null) {
                    // console.log('LANGUAGE SELECTED NOT NULL')
                    // console.log(result.language_selected)
                    dispatch(languageSelectedSuccess(result.language_selected))

                }
                // console.log(JSON.parse(result.languageList))
                dispatch(getLanguageListSuccess(JSON.parse(result.languageList)))

            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
}
export const getRecord = uuid => {
    return dispatch => {
        httpApi.records
            .getRecord(uuid)
            .then(res => {
                let result = parseResponse(res.data.body);
                let recordObject = JSON.parse(result)
                dispatch(getRecordSuccess(recordObject))

            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
};

export const updateTranscript = object => {
    return dispatch => {
        httpApi.transcript
            .updateTranscript(object)
            .then(res => {
                console.log('RESPONSE UPDATE TRANSCRIPT')
                let result = parseResponse(res.data.body);
                let parsedResponse = JSON.parse(result);
                console.log(parsedResponse)

                dispatch(getRecord(object.uuid))
                dispatch(updateTranscriptSuccess('Transcript has been updated successfully'))
            })
            .catch(err => {
                console.log(err);
                dispatch(handleError(err.message));
            });
    };
};
export const updateTranscriptSuccess = message => {
    return {
        type: UPDATE_TRANSCRIPT_SUCCESS,
        message: message
    };
};

export const getLanguageListSuccess = languageList => {
    return {
        type: GET_LANGUAGE_LIST_SUCCESS,
        languageList: languageList
    };
};

export const languageSelectedSuccess = language_selected => {
    return {
        type: LANGUAGE_SELECTED_SUCCESS,
        language_selected: language_selected
    };
};


export const getTranscriptListSuccess = (transcriptionList) => {
    return {
        type: GET_TRANSCRIPT_LIST,
        transcriptionList: transcriptionList
    };
};

export const handleError = message => {
    return {
        type: ERROR_MIDDLEWARE,
        message: message
    };
};
export const showSpinnerAction = () => {
    return dispatch => {
        dispatch(showSpinnerDispatch());
    };
}

export const showSpinnerDispatch = () => {
    return {
        type: SHOW_SPINNER,
    };
};

export const hideSpinnerAction = () => {
    return dispatch => {
        dispatch(hideSpinnerDispatch());
    };
}
export const hideSpinnerDispatch = () => {
    return {
        type: HIDE_SPINNER,
    };
};
export const getRecordSuccess = recordObject => {
    return {
        type: GET_RECORD_SUCCESS,
        recordObject: recordObject
    };
};


export const updateSpinnerAction = (isRecording) => {
    return dispatch => {
        dispatch(updateSpinnerDispatch(isRecording));
    };
}
export const updateSpinnerDispatch = (isRecording) => {
    return {
        type: UPDATE_SPINNER,
        isRecording: isRecording
    };
};

export const updateTranscriptionJobRunning = (isCronRunning) => {
    return {
        type: IS_CRONJOB_RUNNING,
        isCronRunning: isCronRunning
    };
};