import React from 'react';
import {
  getLastRecord,
  deleteRecordRoom
} from '../../../actions/recordListPageActions';
import {
  getTranscriptListByMeetingId,
  showSpinnerAction,
  hideSpinnerAction,
  handleError,
  updateTranscript,
  updateTranscriptSuccess,
  getLanguageList,
  select_language,
} from '../../../actions/roomTranscriptActions';
import { connect } from "react-redux";
import '../../styles/room-transcription-page.css';
import autosize from 'autosize';
import TextareaAutosize from 'react-autosize-textarea';
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';
import {
  parseParamValue,
  removeDuplicatesProp,
  clearListFromEmptyStrings,
  secondsToTime,
  replaceStringByStringList,
  findObjectByKey
} from '../../../utils/Utils';
import * as TYPES from '../../../constants/types';
import { FcFullTrash } from 'react-icons/fc';
import { FiEdit2 } from "react-icons/fi";
import { AiFillDelete } from 'react-icons/ai';
import MDSpinner from "react-md-spinner";
import moment from 'moment'
import $ from "jquery";
import Select from 'react-select';

class RoomTranscriptionPage extends React.Component {
  constructor(props) {
    super(props);

    this.spinnerStyle = { display: "none" };
    this.editStyle = {
      display: "node"
    }

    this.editButtonStyle = {
      display: "none"
    }
    this.submitButtonStyle = {
      display: "none"
    }

    this.state = {
      editing: false,
      transcriptionListInput: [],
      meetingId: "",
      pullDate: "",
      textareaValue: "",
      timeoutCountdown: TYPES.COUNTDOWN_SECONDS,
      previousListCountdownCheck: [],
      showTranscriptUpdateMessage: false,
      languageValueSelected: "Select Language to Convert",
      languageDescription: "US English",
      languageList: [],
      showLanguageSelection: false,
      isModerator: true
    }
    this.timer = this.timer.bind(this);
    this.countDown = this.countDown.bind(this)
    this.onDropdownLanguageSelected = this.onDropdownLanguageSelected.bind(this)
  }


  onChangeValue = (e) => {
    let value = e.target.value;
    this.setState({ name: value });
  }

  componentDidMount() {
    autosize(this.textarea);
    let meetingId = ""
    let isModerator =""
    if (parseParamValue('meetingId') != null) {
      meetingId = parseParamValue('meetingId')
    } else {
      meetingId = TYPES.ADMIN_NAME
    }

    if (parseParamValue('amIModerator') != null) {
      isModerator = parseParamValue('amIModerator')
      isModerator = (isModerator === "true")
    } else {
      isModerator = TYPES.ADMIN_IS_MODERATOR
    }
    
    let intervalId = setInterval(this.timer, Number(TYPES.TIME_FRAME_PULLDATA));

    let timerCountdown = setInterval(this.countDown, Number(TYPES.TIMEOUT_NO_RESPONSE));

    // store intervalId in the state so it can be accessed later:
    this.setState({
      intervalId: intervalId,
      meetingId: meetingId,
      timerCountdown: timerCountdown,
      isModerator: isModerator
    });

    this.props.getTranscriptListByMeetingId(meetingId)
    this.props.getLanguageList(meetingId)

  }
  countDown() {
    // a middle time
    if (this.state.timeoutCountdown == (TYPES.COUNTDOWN_SECONDS - 10)) {
      //here we must verify 
      this.setState({
        previousListCountdownCheck: this.state.transcriptionListInput
      })
    }
    // console.log('COUNTDOWN PROCESS')
    // Remove one second, set state so a re-render happens.
    let newCountdown = this.state.timeoutCountdown - 1;
    this.setState({
      timeoutCountdown: newCountdown,
    });

    // Check if we're at zero.
    if (newCountdown == 0) {

      //here we must verify error scenarios
      if (this.state.previousListCountdownCheck != null
        && this.state.transcriptionListInput != null
        && (this.state.previousListCountdownCheck.length != this.state.transcriptionListInput.length)
        && this.props.isRecording) {

        console.log('EVERYTHING IS FINE WHILE RECORDING')
      } else if (this.state.previousListCountdownCheck != null
        && this.state.transcriptionListInput != null
        && (this.state.previousListCountdownCheck.length == this.state.transcriptionListInput.length)
        && this.props.isRecording) {
        this.props.hideSpinnerAction()
        console.log('EITHER THE SERVICE IS TAKING SO LONG OR SOME PROBLEM WHILE RECORDING')
        this.props.handleError('SERVICE MIGHT BE UNAVAILABLE')
      } else {
        console.log('IS NOT RECORDING')
      }

      this.setState({
        timeoutCountdown: TYPES.COUNTDOWN_SECONDS
      })

    }

  }

  timer() {
    if (
      this.state.meetingId != "") {
      this.props.getTranscriptListByMeetingId(
        this.state.meetingId,
        this.state.pullDate)
    }
  }


  componentWillUnmount() {
    clearInterval(this.state.intervalId);
    clearInterval(this.state.timerCountdown)
    // console.log('COMPONENT DID UNMOUNT!!!!!!!!!!!!!!!!!')
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
          languageDescription: languageSelectedObject.filteredDescription,
          showLanguageSelection: true
        })
      }

    }

    if (
      nextProps.transcriptionList != null &
      nextProps.transcriptionList.length > 0
    ) {

      let transcriptionList = removeDuplicatesProp(nextProps.transcriptionList, 'id')

      transcriptionList = clearListFromEmptyStrings(
        transcriptionList,
        'transcription')
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
    }
    //he handle the list of language list
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
      // console.log('LANGUAGE SELECTED NEXT PROPS')
      // console.log(nextProps.language_selected)
      // console.log(this.props.language_selected)
    }

  }
  componentDidUpdate() {
    //NOW WE RESIZE THE 

    this.state.transcriptionListInput.forEach(element => {
      if (document.getElementById("text-area-" + element.uuid) != null) {
        autosize($("#text-area-" + element.uuid));
        // $("#text-area-" + element.uuid).autogrow();
      }
    });
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
  onDropdownLanguageSelected(e) {
    e.preventDefault();

    console.log("THE VAL", e.target.value);
    let languageSelectedObject = findObjectByKey(this.props.languageList, 'name', e.target.value)
    console.log(languageSelectedObject.description)
    //here you will see the current selected value of the select input
    this.setState({
      languageValueSelected: languageSelectedObject.name,
      languageDescription: languageSelectedObject.filteredDescription
    })
    this.props.select_language(
      languageSelectedObject.name,
      this.state.meetingId,
      languageSelectedObject.description)

  }
  render() {
    // console.log('RENDER PROPS')
    // console.log(this.props)
    // console.log(this.state)
    const {
      hideSpinner,
      errorServer,
      isRecording,
      language_selected
    } = this.props;

    // console.log('RENDER RROM TRANSCRIPTION PAGE')
    // console.log(this.state.languageList)

    return (
      <div className="room-transcription-container">


        {this.state.showLanguageSelection && this.state.isModerator ?
          <div>
            <select
              placeholder="Select Language"
              className="browser-default option-language-selection"
              id="lang"
              onChange={this.onDropdownLanguageSelected}
              // defaultValue={{ label: 2002, value: 2002 }}
              value={this.state.languageValueSelected}>
              {/* <option value="" selected >Select Language, Default English US</option> */}

              {(this.state.languageList != null && this.state.languageList.length > 0) ? this.state.languageList
                .map((listitem, index) => {
                  return (
                    <option className="option-language" key={index} value={listitem.name}>{listitem.filteredDescription}</option>)
                }) : null}
            </select>

            <div className="language-selected-container">Language Selected:  {this.state.languageDescription}</div>
          </div>
          : null}
}

        {(errorServer != "") ? <div className="error-server-message">
          {errorServer + ", SERVICE NOT AVAILABLE"}
        </div> : null}

        {(!hideSpinner && errorServer == "") ? <div className="spinner-transcriptions">
          Waiting for Transcription...  <MDSpinner />
        </div>
          : null}

        <div>
          {this.state.transcriptionListInput != null ? this.state.transcriptionListInput
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
                          defaultValue={this.state.transcriptionListInput[index].transcription}
                          name={this.state.transcriptionListInput[index].uuid}
                          value={this.state[this.state.transcriptionListInput[index].uuid]}
                          onChange={this.onChangeValue}
                          className="default-textarea"
                          onKeyPress={(e) => {
                            this.onEnterPress(e, listitem.uuid)
                          }
                          }
                        />
                        <span className="comment_date">{moment(listitem.createdAt).format('DD MM YYYY hh:mm:ss')}</span>

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
              )

            }) : null}
        </div>
      </div>
    );
  }
}

const mapStateToPropsRoomTranscriptionPage = state => {
  return {
    hideSpinner: state.roomTranscriptionPageReducer.hideSpinner,
    transcription: state.roomTranscriptionPageReducer.transcription,
    uuid: state.roomTranscriptionPageReducer.uuid,
    transcriptionList: state.roomTranscriptionPageReducer.transcriptionList,
    errorServer: state.roomTranscriptionPageReducer.errorServer,
    isRecording: state.roomTranscriptionPageReducer.isRecording,
    updateTranscriptMessage: state.roomTranscriptionPageReducer.updateTranscriptMessage,
    languageList: state.roomTranscriptionPageReducer.languageList,
    language_selected: state.roomTranscriptionPageReducer.language_selected
  };
};

export default withRouter(connect(
  mapStateToPropsRoomTranscriptionPage,
  {
    getLastRecord,
    updateTranscript,
    getTranscriptListByMeetingId,
    deleteRecordRoom,
    showSpinnerAction,
    hideSpinnerAction,
    handleError,
    updateTranscriptSuccess,
    getLanguageList,
    select_language
  }
)(RoomTranscriptionPage));
