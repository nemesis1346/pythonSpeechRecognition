import { ReactMic } from 'react-mic';
import React from 'react';
import { save } from 'save-file'
 

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
    console.log('recordedBlob is: ', recordedBlob);
    // const saveSync = require('save-file/sync')
    // await saveSync(recordedBlob, 'example2.wav')
    await save(recordedBlob, 'example.mp3')


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