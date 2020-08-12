import { ReactMic } from '@cleandersonlobo/react-mic';
import { withRouter } from 'react-router-dom';
// import { ReactMic } from 'react-mic';
import React from 'react';
import {
    uploadBlobAction,
    showSpinnerAction,
    createVttFileByMeetingId,
    hideSpinnerAction,
    getTranscriptListByMeetingIdExternalApp,
    updateRecordingFlag,
    getLanguageList,
    select_language
} from '../../actions/micPageActions';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import autosize from 'autosize';
import '../styles/mic-page.css'
import MDSpinner from "react-md-spinner";
import Blink from 'react-blink-text';
import {
    parseParamValue,
    clearListFromEmptyStrings,
    removeDuplicatesProp,
    findObjectByKey,
    replaceStringByStringList
} from '../../utils/Utils'
import * as TYPES from '../../constants/types';
import moment from 'moment'
import { FcFullTrash } from 'react-icons/fc';
import { FiEdit2 } from "react-icons/fi";
import {
    deleteRecordRoom,
    updateTranscript
} from '../../actions/recordListPageActions';
import $ from "jquery";

class MicPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            record: false,
            globalRecordFlag: false,
            transcriptionListInput: [],
            meetingId: "",
            startDate: 0,
            pullDate: "",
            pullListInterval: "",
            languageValueSelected: "Select Language to Convert",
            languageDescription: "US English",
            languageList: []
        }
        this.timerPullData = this.timerPullData.bind(this)
        this.timer = this.timer.bind(this);
        this.onStop = this.onStop.bind(this)
        this.onData = this.onData.bind(this)
        this.startRecording = this.startRecording.bind(this)
        this.stopRecording = this.stopRecording.bind(this)
        this.globalStartRecording = this.globalStartRecording.bind(this)
        this.globalStopRecording = this.globalStopRecording.bind(this)
        this.createVtt = this.createVtt.bind(this)
        this.onDropdownLanguageSelected = this.onDropdownLanguageSelected.bind(this)

    }
    componentDidUpdate() {
        this.state.transcriptionListInput.forEach(element => {
            if (document.getElementById("text-area-" + element.uuid) != null) {
                autosize($("#text-area-" + element.uuid));
                // $("#text-area-" + element.uuid).autogrow();
            }
        });
    }

    componentDidMount() {
        var constraints = {
            video: false,
            audio: true
        }

        if (navigator.mediaDevices && navigator.mediaDevices != null) {
            navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) { }).catch(function (err) {
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
        if (parseParamValue('meetingId') != null) {
            meetingId = parseParamValue('meetingId')
        } else {
            meetingId = TYPES.ADMIN_NAME
        }

        this.props.getTranscriptListByMeetingIdExternalApp(meetingId)
        var pullListInterval = setInterval(this.timerPullData, Number(TYPES.TIME_FRAME_PULLDATA));

        this.setState({
            meetingId: meetingId,
            pullListInterval: pullListInterval
        })
        this.props.getLanguageList(meetingId)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.language_selected != ""
            && nextProps.language_selected != "No Language Selected"
            && this.props.languageList.length > 0) {

            // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            // console.log(nextProps.language_selected)
            // console.log(this.props.languageList)
            let languageSelectedObject = findObjectByKey(this.props.languageList, 'name', nextProps.language_selected)
            // console.log(languageSelectedObject)

            // //here you will see the current selected value of the select input
            if (languageSelectedObject != null) {
                this.setState({
                    languageValueSelected: languageSelectedObject.name,
                    languageDescription: languageSelectedObject.filteredDescription
                })
            }

        }
        if (
            nextProps.transcriptionList != null &
            nextProps.transcriptionList.length > 0
        ) {
            let transcriptionList = removeDuplicatesProp(nextProps.transcriptionList, 'id')

            transcriptionList = clearListFromEmptyStrings(transcriptionList, 'transcription')
            transcriptionList = transcriptionList
                .sort(
                    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                )
                .reverse()
            transcriptionList = replaceStringByStringList(transcriptionList, 'transcription', "%HESITATION", ",")

            if (transcriptionList.length > 0) {
                let latestDate = transcriptionList[0].createdAt;
                this.setState({
                    pullDate: latestDate,
                    transcriptionListInput: transcriptionList
                })
            }
        } //he handle the list of language list
        if (
            nextProps.languageList != null &
            nextProps.languageList.length > 0
        ) {
            let languageList = removeDuplicatesProp(nextProps.languageList, 'language')
            languageList = languageList
                .sort(function (a, b) {
                    if (a.description < b.description) { return -1; }
                    if (a.description > b.description) { return 1; }
                    return 0;
                })
            languageList.forEach(element => {
                element.filteredDescription = element.description.replace("narrowband model.", "")
                element.filteredDescription = element.filteredDescription.replace("broadband model.", "")
            });
            // console.log('LANGUAGE LIST')
            // console.log(languageList)

            this.setState({
                languageList: languageList
            })
        }
        this.setState({
            record: nextProps.isRecording
        })
    }

    timer() {
        if (this.state.globalRecordFlag && (this.props.errorServer == "")) {
            this.stopRecording()
            this.startRecording()
        } else {

            this.stopRecording()
            this.setState({
                globalRecordFlag: false
            })
            this.props.hideSpinnerAction()
            this.props.updateRecordingFlag(this.state.meetingId, false)
        }
    }

    timerPullData() {
        if (
            this.state.meetingId != "") {

            this.props.getTranscriptListByMeetingIdExternalApp(
                this.state.meetingId,
                this.state.pullDate)
        }
    }

    startRecording() {
        this.setState({
            record: true
        });
    }

    stopRecording() {
        this.setState({
            record: false
        });
    }

    globalStopRecording() {
        clearInterval(this.state.intervalId);

        this.props.hideSpinnerAction()
        this.setState({
            globalRecordFlag: false
        }, () => {
            this.timer()
        });

        this.props.updateRecordingFlag(this.state.meetingId, false)
    }

    componentWillUnmount() {
        clearInterval(this.state.pullListInterval);
        this.props.hideSpinnerAction()

    }

    globalStartRecording() {
        var intervalId = setInterval(this.timer, Number(TYPES.TIME_FRAME_UPLOAD));

        // store intervalId in the state so it can be accessed later:
        this.props.showSpinnerAction()
        this.setState({
            globalRecordFlag: true,
            intervalId: intervalId,
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

    createVtt() {
        this.props.createVttFileByMeetingId(this.state.meetingId)
    }
    onDelete(e, uuid) {
        var result = window.confirm("Want to delete?");
        if (result) {
            //Logic to delete the item
            this.props.deleteRecordRoom(
                uuid,
                this.state.meetingId,
                this.state.pullDate)
            e.preventDefault();
        }
    }

    onEnterPress(e, uuid) {
        var key = window.event.keyCode;
        // If the user has pressed enter
        if (key === 13) {
            let updateTranscriptObject = {
                uuid: uuid,
                transcription: this.state.name
            }

            this.props.updateTranscript(updateTranscriptObject)


            if (document.getElementById("card-container-mic-page-" + uuid) != null) {
                $("#card-container-mic-page-" + uuid)
                    .fadeOut(1000)
                    .fadeIn(1000)
            }
            window.alert("Transcription Updated Successfully");

            e.preventDefault();
            return true;
        }



    }
    onChangeValue = (e) => {
        let value = e.target.value;
        this.setState({ name: value });
    }

    onDropdownLanguageSelected(e) {
        e.preventDefault();

        console.log("THE VAL", e.target.value);
        console.log(this.props)
        let languageSelectedObject = findObjectByKey(this.props.languageList, 'name', e.target.value)
        console.log(languageSelectedObject.description)
        // here you will see the current selected value of the select input
        this.setState({
            languageValueSelected: languageSelectedObject.name,
            languageDescription: languageSelectedObject.filteredDescription
        })
        this.props.select_language(
            languageSelectedObject.name,
            this.state.meetingId,
            languageSelectedObject.description)

    }
    onEditClickHover(e, uuid) {

        if (document.getElementById("text-area-" + uuid) != null) {
            console.log("#text-area-" + uuid)
            console.log($("#text-area-" + uuid))
            $("#text-area-" + uuid)
                .focus()
            // document.getElementById('card-container-mic-page-'+uuid).style.backgroundColor = '#003c8f !important';

        }
        e.preventDefault();

    }
    render() {
        const {
            hideSpinner,
            errorServer,
            isRecording
        } = this.props;

        let btn_play_class = "default waves-effect mic-simple-page-buttons";
        let btn_stop_class = btn_play_class + " record-button";


        return (
            <div className="mic-page-container" >

                <select
                    placeholder="Select Language"
                    class="browser-default option-language-selection"
                    id="lang"
                    onChange={this.onDropdownLanguageSelected}
                    defaultValue={{ label: 2002, value: 2002 }}
                    value={this.state.languageValueSelected}>
                    <option value="" selected >Select Language, Default English US</option>

                    {(this.state.languageList != null && this.state.languageList.length > 0) ? this.state.languageList
                        .map((listitem, index) => {
                            return (
                                <option className="option-language" key={index} value={listitem.name}>{listitem.filteredDescription}</option>)
                        }) : null}
                </select>

                <div className="language-selected-container">Language Selected:  {this.state.languageDescription}</div>

                {
                    /* <button
                              onClick={this.createVtt}
                              type="button">
                                Create Vtt
                            </button> */
                }
                <div >
                    Press the record button to start recording:
            </div>

                <div className="mic-simple-container" >

                    <div >
                        < ReactMic ref={el => this.el = el}
                            id="microphone-react-id"
                            className="react-mic"
                            record={this.state.record}
                            onStop={this.onStop}
                            onData={this.onData}
                            mimeType="audio/wav" />
                    </div>
                    <div >
                        {this.state.record ? null :
                            <button
                                className={btn_play_class}
                                onClick={this.globalStartRecording}
                                type="button" > Record </button>} {
                            this.state.record ?
                                <button
                                    className={btn_stop_class}
                                    onClick={this.globalStopRecording}
                                    type="button" >
                                    <Blink color='white'
                                        text='Stop'
                                        fontSize='20' > Stop </Blink></button > : null
                        }
                    </div>
                </div>

                {(errorServer != "") ? <div>
                    {errorServer}
                </div> : null}

                {(!hideSpinner && errorServer == "") ? <div>
                    Processing Transcription... <MDSpinner />
                </div> : null}

                <div className="transcription-container"> {
                    this.state.transcriptionListInput != null ? this.state.transcriptionListInput
                        .map((listitem, index) => {
                            return (
                                <div className="row" key={listitem.id}>
                                    <div
                                        id={"card-container-mic-page-" + listitem.uuid}
                                        className="card darken-1 card-container-mic-page">
                                        <div className="card-content white-text">
                                            <p>
                                                <textarea
                                                    id={"text-area-" + listitem.uuid}
                                                    name={this.state.transcriptionListInput[index].uuid}
                                                    defaultValue={this.state.transcriptionListInput[index].transcription}
                                                    value={this.state[this.state.transcriptionListInput[index].uuid]}
                                                    className="default-textarea"
                                                    onChange={this.onChangeValue}
                                                    onKeyPress={(e) => {
                                                        this.onEnterPress(e, listitem.uuid)
                                                    }
                                                    }
                                                />
                                                {/* <span className="comment_date">{(new Date(listitem.createdAt)).toUTCString()}</span> */}
                                                <span className="comment_date-mic-page">{moment(listitem.createdAt).format('DD MM YYYY hh:mm:ss')}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="transcript-icons">

                                        <a href="#" onClick={(e) => {
                                            this.onEditClickHover(e, listitem.uuid)
                                        }
                                        }>
                                            <FiEdit2 size="1.6em" />
                                        </a>

                                        <a href="#" onClick={(e) => {
                                            this.onDelete(e, listitem.uuid)
                                        }
                                        }>
                                            <FcFullTrash size="2em" />
                                        </a>

                                    </div>


                                </div>
                            );
                        }) : null
                }
                </div>
            </div>
        );
    }
}

const mapStateToPropsMicPage = state => {
    //In this case objects is gonna be applied to the props of the component
    return {
        hideSpinner: state.micPageReducer.hideSpinner,
        transcription: state.micPageReducer.transcription,
        transcriptionList: state.micPageReducer.transcriptionList,
        errorServer: state.micPageReducer.errorServer,
        languageList: state.micPageReducer.languageList,
        language_selected: state.micPageReducer.language_selected,
        isRecording: state.micPageReducer.isRecording,

    };
};

export default withRouter(connect(
    mapStateToPropsMicPage, {
    uploadBlobAction,
    showSpinnerAction,
    hideSpinnerAction,
    createVttFileByMeetingId,
    getTranscriptListByMeetingIdExternalApp,
    deleteRecordRoom,
    updateTranscript,
    updateRecordingFlag,
    getLanguageList,
    select_language
}
)(MicPage));