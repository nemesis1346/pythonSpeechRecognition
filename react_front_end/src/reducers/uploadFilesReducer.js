//with {} we initialize the action and state
import {
  UPLOAD_WAV_SUCCESS,
   
  } from "../constants/types";
  const initState = {
    hideSpinner:false
  };
  const uploadFilesReducer = (state = initState, action = {}) => {
    switch (action.type) {
      case UPLOAD_WAV_SUCCESS:
        return {
          ...state,

        }; 
      default:
        return state;
    }
  };
  
  export default uploadFilesReducer;
  