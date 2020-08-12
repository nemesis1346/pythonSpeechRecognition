import React from 'react';
import {
  getRecord,
  updateTranscript,
  updateTranscriptSuccess
} from '../../actions/transcriptPageActions';
import { connect } from "react-redux";
import '../styles/transcript-page.css'
import MDSpinner from "react-md-spinner";
import { withRouter } from 'react-router-dom';
import $ from "jquery";
import { FiEdit2 } from "react-icons/fi";

//This is the main transcript of the external App
class TranscriptsPage extends React.Component {
  constructor(props) {
    super(props);

    this.spinnerStyle = {
      display: "none"
    };
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
      transcriptionInput: "",
      showTranscriptUpdateMessage: false
    }

    this.onChangeValue = this.onChangeValue.bind(this);
    this.divRef = React.createRef()
  }

  componentDidMount() {
    if (this.props.location.state != null) {
      this.props.getRecord(this.props.location.state.object.uuid)
    }
  }
  componentDidUpdate() {

    if (this.props.updateTranscriptMessage != ""
      && this.state.showTranscriptUpdateMessage) {
      setTimeout(() => {
        this.setState({
          showTranscriptUpdateMessage: false
        })
        this.props.updateTranscriptSuccess("")
      }, 5000);
    }
  }
  componentWillReceiveProps(nextProps) {

    if (nextProps.updateTranscriptMessage != "") {
      this.setState({
        showTranscriptUpdateMessage: true
      })
    }

    if (nextProps.recordObject != null) {
      this.setState({
        transcriptionInput: nextProps.recordObject.transcription
      });
    }

  }
  onChangeValue(e) {
    let transcriptionInput = e.target.value;
    this.setState({
      transcriptionInput: transcriptionInput,
    })

  }
  onEnterPress(e, uuid) {
    var key = window.event.keyCode;
    // If the user has pressed enter
    if (key === 13) {
      let updateTranscriptObject = {
        uuid: uuid,
        transcription: this.state.transcriptionInput
      }
      this.props.updateTranscript(updateTranscriptObject)

      if (document.getElementById("transcript-card-id") != null) {
        $("#transcript-card-id")
          .fadeOut(1000)
          .fadeIn(1000)
      }
      window.alert("Transcription Updated Successfully");

      e.preventDefault();
      return true;
    }

  }

  onEditClickHover(e) {

    if (document.getElementById("transcript-text-area-id") != null) {

        $("#transcript-text-area-id")
            .focus()

    }
    e.preventDefault();

}
  render() {
    const {
      hideSpinner,
      transcription,
      recordObject
    } = this.props;


    this.spinnerStyle = hideSpinner ? { display: "none" } : {};
    this.editStyle = this.state.editing ? {} : { display: "none" };
    this.editButtonStyle = this.state.editing ? { display: "none" } : {};
    this.submitButtonStyle = this.state.editing ? {} : { display: "none" };

    return (
      <div className="container center">
        <MDSpinner style={this.spinnerStyle} />
        <div className="row">
          <div
            id="transcript-card-id"
            className="card darken-1 transcript-card">
            <div className="card-content white-text">
              <p>
                <textarea
                  id="transcript-text-area-id"
                  value={this.state.transcriptionInput}
                  onChange={this.onChangeValue}
                  className="default-textarea"
                  onKeyPress={(e) => {
                    this.onEnterPress(e, recordObject.uuid)
                  }}>
                </textarea>
              </p>
            </div>
          </div>
          <div className="transcript-icons">

            <a href="#" onClick={(e) => {
              this.onEditClickHover(e)
            }
            }>
              <FiEdit2 size="1.6em" />
            </a>
          </div>

        </div>
        Press Enter to Edit Transcription
        {this.state.showTranscriptUpdateMessage ? <div
          id="Message Update"
          ref={divEl => {
            this.divRef = divEl;
          }}>Transcript has been updated Successfully</div> : null}
      </div>
    );
  }
}


const mapStateToPropsTranscriptPage = state => {
  //In this case objects is gonna be applied to the props of the component
  return {
    hideSpinner: state.transcriptPageReducer.hideSpinner,
    transcription: state.transcriptPageReducer.transcription,
    recordObject: state.transcriptPageReducer.recordObject,
    updateTranscriptMessage: state.transcriptPageReducer.updateTranscriptMessage
  };
};

export default withRouter(connect(
  mapStateToPropsTranscriptPage,
  {
    getRecord,
    updateTranscript,
    updateTranscript,
    updateTranscriptSuccess
  }
)(TranscriptsPage));
