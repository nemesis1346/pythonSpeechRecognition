//with {} we initialize the action and state
import {
    UPLOAD_OBJECT_SUCCESS,
   
  } from "../constants/types";
  const initState = {
   
  };
  const uploadFilesReducer = (state = initState, action = {}) => {
    switch (action.type) {
      case UPLOAD_OBJECT_SUCCESS:
        return {
          ...state,

        }; 
      default:
        return state;
    }
  };
  
  export default uploadFilesReducer;
  