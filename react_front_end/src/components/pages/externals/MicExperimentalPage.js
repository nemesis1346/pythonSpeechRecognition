import React from 'react';
import { ReactMic } from '@cleandersonlobo/react-mic';
import {
    uploadBlobAction,
    showSpinnerAction,
    hideSpinnerAction,
    createVttFileByMeetingId,
    updateRecordingFlag
} from '../../../actions/micPageActions';
import { connect } from "react-redux";
import '../../styles/mic-experimental-page.css'
import Blink from 'react-blink-text';
import { withRouter } from 'react-router-dom';
import { parseParamValue } from '../../../utils/Utils'
import * as TYPES from '../../../constants/types';

class MicExperimentalPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            record: false,
            globalRecordFlag: false,
            startDate: 0,
            meetingId: ""
        }
        this.timer = this.timer.bind(this);
        this.onStop = this.onStop.bind(this)
        this.onData = this.onData.bind(this)
        this.startRecording = this.startRecording.bind(this)
        this.stopRecording = this.stopRecording.bind(this)
        this.globalStartRecording = this.globalStartRecording.bind(this)
        this.globalStopRecording = this.globalStopRecording.bind(this)
        this.spinnerStyle = { display: "none" };
    }


    componentDidMount() {
        var constraints = {
            video: false,
            audio: true
        }

        if (navigator.mediaDevices && navigator.mediaDevices != null) {
            navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
                console.log('NO PROBLEMS WITH MICROPHONE')
            }).catch(function (err) {
                console.log('MEDIA ERRORS')
                //log to console first 
                console.log(err); /* handle the error */
                if (err.name == "NotFoundError" || err.name == "DevicesNotFoundError") {
                    console.log('required track is missing');
                } else if (err.name == "NotReadableError" || err.name == "TrackStartError") {
                    console.log('webcam or mic are already in use');
                } else if (err.name == "OverconstrainedError" || err.name == "ConstraintNotSatisfiedError") {
                    console.log('constraints can not be satisfied by avb. devices')
                } else if (err.name == "NotAllowedError" || err.name == "PermissionDeniedError") {
                    console.log('permission denied in browser')
                } else if (err.name == "TypeError" || err.name == "TypeError") {
                    console.log('empty constraints object')
                } else {
                    console.log('other errors')
                }
            });
        } else {
            console.log('MEDIA DEVICES:');
            console.log(navigator.mediaDevices);
        }

        let meetingId = ""
        console.log('RECEIVING MEETING ID')
        console.log(parseParamValue('meetingId'))
        if (parseParamValue('meetingId') != null) {
            meetingId = parseParamValue('meetingId')
        } else {
            meetingId = TYPES.ADMIN_NAME
        }
      
        this.setState({meetingId:meetingId})
    }

    componentWillUnmount() {
    }
    componentWillReceiveProps(nextProps) {
    }

    timer() {
        if (this.state.globalRecordFlag&&(this.props.errorServer=="")) {
            this.stopRecording()
            this.startRecording()

        } else {
            console.log('STOPING THE MIC TIMMER')
            this.stopRecording()
            this.setState({
                globalRecordFlag: false
            })
            this.props.hideSpinnerAction()
            this.props.updateRecordingFlag(this.state.meetingId, false)
        }
    }

    startRecording() {
        this.setState({
            record: true,
        });
    }


    stopRecording(e) {
        this.setState({
            record: false
        });
    }

    globalStopRecording() {
        clearInterval(this.state.intervalId);
        this.setState({
            globalRecordFlag: false
        }, () => {
            this.timer()
        });

        // this.props.createVttFileByMeetingId(this.state.meetingId)
        this.props.updateRecordingFlag(this.state.meetingId, false)

    }

    globalStartRecording() {
        var intervalId = setInterval(this.timer, Number(TYPES.TIME_FRAME_UPLOAD));
        this.setState({ intervalId: intervalId });
        this.setState({
            globalRecordFlag: true,
            startDate: new Date().getTime()
        }, () => {
            this.timer()
        });
        this.props.updateRecordingFlag(this.state.meetingId, true)
    }


    onData = (recordedBlob) => {

    }

    onStop = (recordedBlob) => {
        //here we calculate the timer
        let endDate = new Date().getTime();
        let currentSeconds = Number((endDate - this.state.startDate) / 1000);
        let previousStartDate = currentSeconds - (Number(TYPES.TIME_FRAME_UPLOAD) / 1000)

        //here we send the data
        let blobData = recordedBlob.blob;
        const data = new FormData();
        data.append('wavFile', blobData);
       
        this.props.uploadBlobAction(data, this.state.meetingId, previousStartDate, currentSeconds);

        this.setState({
            totalTime: currentSeconds,
        })
    }

    render() {
        const {
            hideSpinner,
            blobErrorList,
            errorServer
        } = this.props;
        this.spinnerStyle = hideSpinner ? { display: "none" } : {};
        let btn_play_class = "default waves-effect mic-experimental-page-buttons";
        let btn_stop_class = btn_play_class + " record-button";
        return (
            <div className="mic-experimental-page-container">

                <div>
                    <ReactMic
                        id = "react-mic-id"
                        className="react-mic"
                        record={this.state.record}
                        onStop={this.onStop}
                        onData={this.onData}
                        mimeType="audio/wav"
                    />
                </div>
                <div id ="mic-experimental-container-id" className="mic-experimental-container">
                    {this.state.record ? null :
                        <button
                            id ="play-button-id"
                            className={btn_play_class}
                            onClick={this.globalStartRecording}
                            type="button">Record</button>}
                    {this.state.record ?
                        <button
                            id ="stop-button-id"
                            className={btn_stop_class}
                            onClick={this.globalStopRecording}
                            type="button">
                            <Blink color='white' text='Stop' fontSize='20'>Stop</Blink></button> : null}

                </div>
            </div>
        );
    }
}

const mapStateToPropsMicPage = state => {
    //In this case objects is gonna be applied to the props of the component
    return {
        hideSpinner: state.micPageReducer.hideSpinner,
        blobErrorList:state.micPageReducer.blobErrorList,
        errorServer:state.micPageReducer.errorServer
    };
};

export default withRouter(connect(
    mapStateToPropsMicPage,
    {
        uploadBlobAction,
        showSpinnerAction,
        updateRecordingFlag,
        hideSpinnerAction,
        createVttFileByMeetingId
    }
)(MicExperimentalPage));
