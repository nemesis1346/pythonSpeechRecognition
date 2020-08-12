import React from 'react';
import MicPage from './components/pages/MicPage.js'
import RecordListPage from './components/pages/RecordListPage.js'
import TranscriptsPage from './components/pages/TranscriptsPage';
import TranscriptSubrecordingsPage from './components/pages/TranscriptSubrecordingsPage';
import NavBar from './components/navigation/NavBar';
import { BrowserRouter, Route, Switch, withRouter, HashRouter } from 'react-router-dom';
import PendingRecordsConversionPage from './components/pages/PendingRecordsConversionPage';
import * as ROUTES from './constants/routes';
import {
  parseParamValue,
} from './utils/Utils'
import * as TYPES from './constants/types';


class ExternalApp extends React.Component {
  constructor() {
    super();
    this.state = {
      transcriptionList: [],
      meetingId: "",

    }
    this.onLoginCallback = this.onLoginCallback.bind(this);

  }
  onLoginCallback() {
  }
  componentDidMount() {
 
  }

  render() {
    return (
      <HashRouter>

        <div className="App">
          <NavBar onLoginCallback={this.onLoginCallback}
          ></NavBar>
          <Route path="/" exact
            component={MicPage}></Route>

          <Route path={ROUTES.ROUTE_MIC_PAGE} exact
            component={MicPage}></Route>

          <Route path={ROUTES.ROUTE_RECORD_LIST_PAGE} exact
            component={RecordListPage}></Route>

          <Route path={ROUTES.ROUTE_PENDING_RECORDS_CONVERSION} exact
            component={PendingRecordsConversionPage}></Route>

          <Route path={ROUTES.ROUTE_TRANSCRIPT} exact
            component={TranscriptsPage}></Route>

          <Route path={ROUTES.ROUTE_TRANSCRIPT_SUBRECORDINGS} exact
            component={TranscriptSubrecordingsPage}></Route>

          {/* <Route path={ROUTES.ROUTE_MIC_EXPERIMENTAL} exact component={MicExperimentalPage}></Route> */}

        </div>
      </HashRouter>
    );
  }
}

export default withRouter(ExternalApp);

