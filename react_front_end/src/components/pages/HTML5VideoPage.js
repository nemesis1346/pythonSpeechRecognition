import { ReactMic } from '@cleandersonlobo/react-mic';
import { withRouter } from 'react-router-dom';
// import { ReactMic } from 'react-mic';
import React from 'react';
import {
  uploadBlobAction,
  showSpinnerAction
} from '../../actions/micPageActions';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import '../styles/mic-page.css'

//for video 
import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';
import sample from './sample.mp4'
import vttSub from './subtitles.vtt';
import textSub from './text.vtt';
const NoVNC = require('react-novnc').default

class HTML5VideoPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      record: false
    }
    this.onDisconnected=this.onDisconnected.bind(this)

  }

  componentDidMount() {

  }
  onDisconnected(){

  }

  render() {
    const {
      hideSpinner,
      transcription
    } = this.props;
    this.spinnerStyle = hideSpinner ? { display: "none" } : {};

    return (
      <div className="container">

        <video id="my-video-stream" width="1280" height="720" controls crossOrigin="true">
          <source src={sample} type='video/mp4;codecs="avc1.42E01E, mp4a.40.2"' />
          <track label="English" kind="subtitles" src={textSub} srcLang="en" label="English" />
        </video>
        {/* 

        {/* <Video autoPlay loop muted
          controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
          onCanPlayThrough={() => {
            // Do stuff
          }}>
          <source src={sample} type="video/mp4" />
          <track label="English" kind="subtitles" srcLang="en" src={vttSub} default />
        </Video> */}

        <NoVNC connectionName='wss://fl1us.npg.io/t/websockify?record=mmaigua-7983b.1594674149016.rJPFHeAS16VoN0xa.057776c1-ab1f-4285-99ae-55db35da391f-401ae759-be23-469d-87e5-14091195a56a.rec'
          onDisconnected={this.onDisconnected}
          isSecure={true}
          // actionsBar={(props) => <SomeActionsList onDisconnect={props.onDisconnect} />}
          // passwordPrompt={(props) => <SomePasswordComponent onSubmit={props.onSubmit} />} 
          />
      </div>
    );
  }
}

//This is just validation of the props
HTML5VideoPage.propTypes = {
  uploadBlobAction: PropTypes.func.isRequired,
};

const mapStateToPropsMicPage = state => {
  //In this case objects is gonna be applied to the props of the component
  return {
    hideSpinner: state.micPageReducer.hideSpinner,
    transcription: state.micPageReducer.transcription
  };
};

export default withRouter(connect(
  mapStateToPropsMicPage,
  { uploadBlobAction, showSpinnerAction }
)(HTML5VideoPage));
