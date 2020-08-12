import {
  UPLOAD_WAV_SUCCESS,
  SHOW_SPINNER,
  CONVERT_RECORD_SUCCESS,
  HIDE_SPINNER,
  GET_TRANSCRIPT_LIST,
  BLOB_ERROR,
  GET_LANGUAGE_LIST_SUCCESS,
  UPDATE_SPINNER,
  IS_CRONJOB_RUNNING,
  LANGUAGE_SELECTED_SUCCESS
} from "../constants/actions";
import { ERROR_MIDDLEWARE }
  from '../constants/errors';
import httpApi from "../api/httpApi";
import { parseResponse } from '../utils/Utils';


//this is the entire latest transcrption list
export const getTranscriptListByMeetingIdExternalApp = (meetingId, pullDate) => {
  let request = {
    meetingId: meetingId,
    pullDate: pullDate
  }
  return dispatch => {
    httpApi.records
      .getTranscriptListByMeetingId(request)
      .then(res => {
        let result = JSON.parse(parseResponse(res.data.body));
          console.log('RESULT TRANSCRIPTION LIST WITH MEETING ID')
                console.log(result)
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
export const getTranscriptListSuccess = (transcriptionList) => {
  return {
    type: GET_TRANSCRIPT_LIST,
    transcriptionList: transcriptionList
  };
};


export const uploadBlobAction = (blob, meetingId, startTime, endTime) => {
  return dispatch => {
    httpApi.files
      .uploadBlob(blob, meetingId, startTime, endTime)
      .then(res => {
        let uuid = parseResponse(res.data.body);
        let message = JSON.parse(res.data.body).message;
        dispatch(uploadBlobSuccess(message)) //this hides the spinner too
      })
      .catch(err => {
        console.log(err);
        //if it fails needs to update the list
        console.log('WARN!!! , RECORD COULD NOT BE UPLOADED at' + startTime)
        dispatch(uploadBlobError(blob, meetingId, startTime, endTime))
        dispatch(handleError(err.message));
      });
  };
};
//maybe this function is not required anymore
export const convertRecord = (uuid, meetingId) => {
  let request = {
    uuid: uuid,
    meetingId: meetingId
  }
  return dispatch => {
    httpApi
      .convert
      .convertRecord(request)
      .then(res => {
        let transcriptionObject = parseResponse(res.data.body);

        let message = JSON.parse(res.data.body).message;
        // dispatch(uploadBlobSuccess(message))
        dispatch(onConvertRecordSuccess(transcriptionObject))
      })
      .catch(err => {
        console.log(err);
        dispatch(handleError(err.message));
      });
  };
};
export const uploadBlobError = (blob, meetingId, startTime, endTime) => {
  let blobObject = {
    blob: blob,
    meetingId: meetingId,
    startTime: startTime,
    endTime: endTime
  }
  return {
    type: BLOB_ERROR,
    blobObject: blobObject
  };
};

export const updateRecordingFlag = (meetingId, flag) => {
  console.log('UPDATE RECORDING FLAG ACTION')
  console.log(meetingId)
  console.log(flag)
  let request = {
    meetingId: meetingId,
    isRecording: flag
  }
  return dispatch => {
    httpApi
      .convert
      .updateRecordingFlag(request)
      .then(res => {
        let result = parseResponse(res.data.body);
      })
      .catch(err => {
        console.log(err);
        dispatch(handleError(err.message));
      });
  };
};

export const createVttFileByRecordId = (uuid) => {
  return dispatch => {
    httpApi
      .files
      .createVttFileByRecordId(uuid)
      .then(res => {
        // dispatch(uploadBlobSuccess(message))
        // dispatch(onConvertRecordSuccess(transcription))

      })
      .catch(err => {
        console.log(err);
        dispatch(handleError(err.message));
      });
  };
}

export const createVttFileByMeetingId = (meetingId) => {
  return dispatch => {
    httpApi
      .files
      .createVttFileByMeetingId(meetingId)
      .then(res => {


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

export const onConvertRecordSuccess = (transcriptionObject) => {
  return {
    type: CONVERT_RECORD_SUCCESS,
    transcriptionObject: transcriptionObject
  };
};

export const uploadBlobSuccess = data => {
  return {
    type: UPLOAD_WAV_SUCCESS,
    data: data
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
export const handleError = message => {
  return {
    type: ERROR_MIDDLEWARE,
    message: message
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