//This is for showing the converted files
import React from 'react';
import {
    showSpinnerAction
} from '../../actions/micPageActions';
import { getAllSubRecordingsById } from '../../actions/recordingsPageActions';
import { connect } from "react-redux";
import '../styles/transcript-subrecordings-page.css'
import MDSpinner from "react-md-spinner";
import SubrecordingsTable from "../tables/subrecordingsTable";
import { Message } from "semantic-ui-react";

class TranscriptSubrecordingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            record: false
        }

        this.spinnerStyle = { display: "none" };
    }


    componentWillMount() {
        if (this.props.location.state && this.props.location.state!= null) {
            this.props.getAllSubRecordingsById(this.props.location.state.object.uuid);
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
            <div className="container center transcript-subrecordings-page-container">

                <Message hidden={hideResultMessage}>
                    <Message.Header>Error</Message.Header>
                    <p>There is no results</p>
                </Message>

                <SubrecordingsTable
                    objectList={objects}
                // onClickPlayCallback={this.onClickPlayCallback}
                // onTranscriptCellCallback={this.onTranscriptCellCallback}
                />
                <MDSpinner style={this.spinnerStyle} />

            </div>
        );
    }
}


const mapStateToPropsTranscriptRecordingsPage = state => {
    return {
        hideSpinner: state.transcriptSubrecordingsPageReducer.hideSpinner,
        hideResultMessage: state.transcriptSubrecordingsPageReducer.hideResultMessage,
        objects: state.transcriptSubrecordingsPageReducer.objects
    };
};

export default connect(
    mapStateToPropsTranscriptRecordingsPage,
    {
        showSpinnerAction,
        getAllSubRecordingsById,
    }
)(TranscriptSubrecordingsPage);
