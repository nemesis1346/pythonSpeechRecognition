import { ReactMic } from 'react-mic';
import React from 'react';
import { save } from 'save-file'
// import fs from 'fs'
var fs = require('browserify-fs');
const write = require('write');


class ReactMicCustomPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      record: false
    }

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
    console.log('recordedBlob is: ', recordedBlob.blob);
    // const saveSync = require('save-file/sync')
    // await saveSync(recordedBlob, 'example2.wav')
    await save(recordedBlob.blob, "/home/lenovo/Documents/projects/python_speech_scripts/react_mic/example.wav")
//     var blobUrl = URL.createObjectURL(recordedBlob.blob);
// console.log(blobUrl)

    // console.log(fs);
    // fs.writeFile("test.wav", recordedBlob.blob, function(err) {
    //   if(err) {
    //     console.log("err", err);
    //   } else {
    //     console.log('success')
    //   }
    // }); 

    // fs.writeFile('/home/lenovo/Documents/projects/python_speech_scripts/react_mic/example.wav', recordedBlob.blob, function() {
     
    // });
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
export default ReactMicCustomPage;