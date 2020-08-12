//This is for showing the converted files
import React from 'react';
import {
    getAllRecordsNotConverted,
    showSpinner,
    convertAllRecords,
    convertRecordsPendingList
} from '../../actions/pendingRecordsConvertionPageActions';
import { connect } from "react-redux";
import '../styles/pending-conversion-page.css'
import MDSpinner from "react-md-spinner";
import RecordsTableNotConverted from "../tables/recordsTableNotConverted";
import { Message } from "semantic-ui-react";
import { parseParamValue } from '../../utils/Utils'
import * as TYPES from '../../constants/types';

class PendingRecordsConversionPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            record: false,
            meetingId: ""

        }

        this.spinnerStyle = { display: "none" };
        this.onClickConvertAll = this.onClickConvertAll.bind(this);
        this.onClickConvertCallback = this.onClickConvertCallback.bind(this)
    }
    componentDidMount() {
        let meetingId = ""
        console.log('RECEIVING MEETING ID')
        console.log(parseParamValue('meetingId'))
        if (parseParamValue('meetingId') != null) {
            meetingId = parseParamValue('meetingId')
        } else {
            meetingId = TYPES.ADMIN_NAME
        }

        this.setState({ meetingId: meetingId })

    }
    componentWillMount() {
        //Here we can call to the props
        this.props.getAllRecordsNotConverted();
    }

    onClickConvertCallback = (object) => {
        this.props.convertRecordsPendingList(object.uuid,this.state.meetingId)
    };

    onClickConvertAll() {
        this.props.showSpinner();
        this.props.convertAllRecords()
    }

    render() {
        const {
            hideSpinner,
            objects,
            hideResultMessage
        } = this.props;
        this.spinnerStyle = hideSpinner ? { display: "none" } : {};


        return (
            <div className="container center pending-conversion-page-container">
                <button
                    type="button"
                    className='waves-effect waves-light btn mic-page-buttons'
                    onClick={this.onClickConvertAll}
                >
                    Convert All
           </button>
                <MDSpinner style={this.spinnerStyle} />

                <Message hidden={hideResultMessage}>
                    <Message.Header>Error</Message.Header>
                    <p>There is no results</p>
                </Message>

                <RecordsTableNotConverted
                    objectList={objects}
                    onClickConvertCallback={this.onClickConvertCallback}
                />

            </div>
        );
    }
}


const mapStateToPropsPendingRecordsConvertionPage = state => {
    return {
        hideSpinner: state.pendingRecordsConvertionPageReducer.hideSpinner,
        hideResultMessage: state.pendingRecordsConvertionPageReducer.hideResultMessage,
        objects: state.pendingRecordsConvertionPageReducer.objects
    };
};

export default connect(
    mapStateToPropsPendingRecordsConvertionPage,
    {
        showSpinner,
        getAllRecordsNotConverted,
        convertAllRecords,
        convertRecordsPendingList
    }
)(PendingRecordsConversionPage);
