import { ReactMic } from 'react-mic';
import React from 'react';
import { uploadBlobAction } from '../../actions/uploadFilesActions';
import PropTypes from "prop-types";
import { connect } from "react-redux";

class MicPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      record: false
    }

    this.onStop = this.onStop.bind(this)

  }

  startRecording = () => {
    console.log('ON START RECORDING');
    this.setState({
      record: true
    });
  }

  stopRecording = () => {
    console.log('ON STOP RECORDING');

    this.setState({
      record: false
    });
  }

  onData(recordedBlob) {
    console.log('ON CLICK DATA');
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  async onStop(recordedBlob) {
    console.log(recordedBlob)
    console.log('recordedBlob is: ', recordedBlob.blob);

    let blobData = recordedBlob.blob;
    const data = new FormData();
    data.append('wavFile', blobData);
    this.props.uploadBlobAction(data);
  }

  render() {
    return (
      <div>
        <ReactMic
          record={this.state.record}
          className="sound-wave"
          onStop={this.onStop}
          onData={this.onData}
          strokeColor="#000000"
          backgroundColor="#FF4081" />
        <button onClick={this.startRecording} type="button">Start</button>
        <button onClick={this.stopRecording} type="button">Stop</button>
      </div>
    );
  }
}

//This is just validation of the props
MicPage.propTypes = {
  uploadBlobAction: PropTypes.func.isRequired,
};

const mapStateToPropsMicPage = state => {
  //In this case objects is gonna be applied to the props of the component
  return {
    hideSpinner: state.uploadFilesReducer.hideSpinner,

  };
};

export default connect(
  mapStateToPropsMicPage,
  { uploadBlobAction }
)(MicPage);
