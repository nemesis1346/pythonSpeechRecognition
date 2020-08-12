//This is for showing the converted files
import React from 'react';
import {
    showSpinnerAction
} from '../../actions/micPageActions';
import {
    getAllRecordsConverted,
    getRecord,
    streamRecord,
    downloadRecord,
    deleteRecord
} from '../../actions/recordListPageActions';
import { connect } from "react-redux";
import '../styles/stream-audio-page.css'
import MDSpinner from "react-md-spinner";
import RecordsTableConverted from "../tables/recordsTableConverted";
import { Message } from "semantic-ui-react";
import {
    parseParamValue,
} from '../../utils/Utils'
import * as TYPES from '../../constants/types';

class RecordListPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            record: false,
            meetingId: ""
        }

        this.spinnerStyle = { display: "none" };
        this.onClickPlayCallback = this.onClickPlayCallback.bind(this)
        this.onTranscriptCellCallback = this.onTranscriptCellCallback.bind(this)
        this.onClickDownloadCallback = this.onClickDownloadCallback.bind(this)
        this.onClickDeleteCallback = this.onClickDeleteCallback.bind(this)
    }

    componentDidMount() {
        let meetingId = ""
        if (parseParamValue('meetingId') != null) {
            meetingId = parseParamValue('meetingId')
        } else {
            meetingId = TYPES.ADMIN_NAME
        }
        console.log(meetingId)
        this.setState({ meetingId: meetingId })
        this.props.getAllRecordsConverted(meetingId);

    }


    componentWillMount() {
        // this.props.getAllRecordsConverted();
    }

    onClickPlayCallback(object) {
        this.props.streamRecord(object.uuid);
    }
    onClickDownloadCallback(object) {
        this.props.downloadRecord(object.uuid);
    }
    onTranscriptCellCallback(object) {
        this.props.getRecord(object.uuid);
    }
    onClickDeleteCallback(object) {
        var result = window.confirm("Want to delete?");
        if (result) {
            this.props.deleteRecord(object.uuid, this.state.meetingId)
        }
    }

    render() {
        const {
            hideSpinner,
            objects,
            hideResultMessage
        } = this.props;
        this.spinnerStyle = hideSpinner ? { display: "none" } : {};


        return (
            <div className="container center stream-audio-page-container">

                <Message hidden={hideResultMessage}>
                    <Message.Header>Error</Message.Header>
                    <p>There is no results</p>
                </Message>

                <RecordsTableConverted
                    objectList={objects}
                    onClickPlayCallback={this.onClickPlayCallback}
                    onTranscriptCellCallback={this.onTranscriptCellCallback}
                    onClickDownloadCallback={this.onClickDownloadCallback}
                    onClickDeleteCallback={this.onClickDeleteCallback}
                />
                <MDSpinner style={this.spinnerStyle} />

            </div>
        );
    }
}


const mapStateToPropsStreamAudioPage = state => {
    return {
        hideSpinner: state.recordListPageReducer.hideSpinner,
        hideResultMessage: state.recordListPageReducer.hideResultMessage,
        objects: state.recordListPageReducer.objects
    };
};

export default connect(
    mapStateToPropsStreamAudioPage,
    {
        showSpinnerAction,
        getAllRecordsConverted,
        getRecord,
        streamRecord,
        downloadRecord,
        deleteRecord
    }
)(RecordListPage);
