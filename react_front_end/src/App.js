import React from 'react';
import MicPage from './components/pages/MicPage.js'
import ExternalApp from './ExternalApp.js';
import TranscriptsPage from './components/pages/TranscriptsPage';
import HTML5VideoPage from './components/pages/HTML5VideoPage';
import TranscriptSubrecordingsPage from './components/pages/TranscriptSubrecordingsPage';
import { BrowserRouter, Route, Switch, Router, HashRouter } from 'react-router-dom';
import MicExperimentalPage from './components/pages/externals/MicExperimentalPage'
import { casLogin } from './actions/authActions';
import { connect } from "react-redux";
import * as ROUTES from './constants/routes';
import RoomTranscriptionPage from './components/pages/externals/RoomTranscriptionPage';

class App extends React.Component {
  constructor() {
    super();
    this.onLoginCallback = this.onLoginCallback.bind(this);

  }
  onLoginCallback() {
    this.props.casLogin();
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route path={ROUTES.ROUTE_EXTERNAL_APP} component={ExternalApp}></Route>

          <Route path={ROUTES.ROUTE_MIC_PAGE} component={MicPage}></Route>
          <Route path={ROUTES.ROUTE_TRANSCRIPT_ALONE} component={TranscriptsPage}></Route>
          <Route path={ROUTES.ROUTE_TRANSCRIPT_SUBRECORDINGS} component={TranscriptSubrecordingsPage}></Route>
          <Route path={ROUTES.ROUTE_HTML5VIDEO_PAGE} component={HTML5VideoPage}></Route>

          {/* The following are now being shown in the room app */}
          <Route path={ROUTES.ROUTE_MIC_ROOM} component={MicExperimentalPage}></Route>
          <Route path={ROUTES.ROUTE_ROOM_TRANSCRIPT} component={RoomTranscriptionPage}></Route>
        </Switch>
      </div>
    );
  }
}

export default connect(null, { casLogin })(App);
