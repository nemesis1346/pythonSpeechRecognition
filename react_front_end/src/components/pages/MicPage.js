import { ReactMic } from 'react-mic';
import React from 'react';
import { save } from 'save-file'
import { saveAs } from 'file-saver';
import { uploadBlobAction } from '../../actions/uploadFilesActions';
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import fs from 'fs'
var fs = require('browserify-fs');
const write = require('write');


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
    // const saveSync = require('save-file/sync')
    // await saveSync(recordedBlob, 'example2.wav')
    // await save(recordedBlob.blob, "/home/lenovo/Documents/projects/python_speech_scripts/react_mic/example.wav")
    //     var blobUrl = URL.createObjectURL(recordedBlob.blob);
    // console.log(blobUrl)

    // console.log(fs);

    let blobData = recordedBlob.blob;

    const data = new FormData();

    data.append('wavFile', blobData, 'wavFile.wav');
    console.log(data)
    this.props.uploadBlobAction(data);


    // fs.writeFile("/home/hello-world.txt", 'recordedBlob.blob', function(err) {
    //   if(err) {
    //     console.log("err", err);
    //   } else {
    //     console.log('success')
    //   }
    // }); 

    // fs.writeFile('/home/lenovo/Documents/projects/python_speech_scripts/react_mic/example.wav', recordedBlob.blob, function() {

    // });


    // var FileSaver = require('file-saver');
    // saveAs(recordedBlob.blob, "../test.wav");
  }

  render() {
    return (
      <div>
        <div>
          TESTING
        </div>
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
