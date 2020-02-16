import {
  UPLOAD_WAV_SUCCESS,
  ERROR_MIDDLEWARE,
} from "../constants/types";
import httpApi from "../api/httpApi";

export const uploadBlobAction = input => {
  return dispatch => {
    httpApi.files
      .uploadBlob(input)
      .then(res => {
        console.log(res);

      })
      .catch(err => {
        console.log(err);
        dispatch(handleError(err.message));
      });
  };
};


const uploadBlobSuccess = data => {
  return {
    type: UPLOAD_WAV_SUCCESS,
    data: data
  };
};

const handleError = message => {
  return {
    type: ERROR_MIDDLEWARE,
    message: message
  };
};
