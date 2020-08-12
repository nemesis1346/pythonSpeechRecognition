
//These are for external app paths
export const ROUTE_MIC_PAGE = '/micPage';
export const ROUTE_RECORD_LIST_PAGE="/recordList";
export const ROUTE_PENDING_RECORDS_CONVERSION="/pendingRecordsConversion";
export const ROUTE_TRANSCRIPT="/transcript";
//These are for direct paths
export const ROUTE_TRANSCRIPT_ALONE="/transcriptAlone";
export const ROUTE_ROOM_TRANSCRIPT="/transcript"; //this must not change
export const ROUTE_MIC_ROOM="/microphone"; //this must not change
export const ROUTE_MIC_PAGE_ALONE="/micPage";
export const ROUTE_TRANSCRIPT_SUBRECORDINGS="/transcriptSubrecordings";
export const ROUTE_HTML5VIDEO_PAGE="/html5VideoPage";
//These are main paths
export const ROUTE_BASENAME=process.env.REACT_APP_BASENAME;
export const ROUTE_EXTERNAL_APP="/externalApp"; //this must not change

//This is for the server
export const REACT_APP_SERVER_HOST=process.env.REACT_APP_SERVER_HOST;
export const SPEECH_APP_URL=process.env.REACT_APP_SPEECHAPP_URL