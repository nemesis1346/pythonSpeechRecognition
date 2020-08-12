import React from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { parseResponse, clearListFromEmptyStrings } from '../../utils/Utils';

class RecordsTableConverted extends React.Component {
    constructor() {
        super();
        this.onClickPlay = this.onClickPlay.bind(this);
        this.onClickTranscript = this.onClickTranscript.bind(this)
        this.onClickDownload = this.onClickDownload.bind(this)
        this.onClickDelete = this.onClickDelete.bind(this)
    }


    onPlayCell(cell, row, enumObject, rowIndex) {
        return (
            <button
                type="button"
                className='waves-effect waves-light btn mic-page-buttons'
                onClick={() => {
                    this.onClickPlay(row)
                }}
            >
                Play

            </button>
        )
    }

    onClickPlay(input) {
        this.props.onClickPlayCallback(input);
    }

    onDownloadCell(cell, row, enumObject, rowIndex) {
        console.log('ON CLICK DOWNLOAD CELL')

        return (
            <button
                type="button"
                className='waves-effect waves-light btn mic-page-buttons'
                onClick={() => {
                    this.onClickDownload(row)
                }}
            >
                Download

            </button>
        )
    }

    onClickDownload(input) {
        console.log('ON CLICK DOWNLOAD CALLBACK')
        this.props.onClickDownloadCallback(input);
    }


    onTranscriptCell(cell, row, enumObject, rowIndex) {
        return (

            <Link to={{
                pathname: ROUTES.ROUTE_TRANSCRIPT,
                state: {
                    object: row
                }
            }}>
                <button
                    type="button"
                    className='waves-effect waves-light btn mic-page-buttons'
                >
                    Transcript
           </button>
            </Link>

        )
    }


    onDeleteCell(cell, row, enumObject, rowIndex) {
        return (
            <button
                type="button"
                className='waves-effect waves-light btn mic-page-buttons'
                onClick={() => {
                    this.onClickDelete(row)
                }}
            >
                Delete

            </button>
        )
    }

    onClickDelete(input) {
        console.log('ON CLICK DELETE CALLBACK')
        this.props.onClickDeleteCallback(input);
    }


    onSubRecordsCell(cell, row, enumObject, rowIndex) {
        return (

            <Link to={{
                pathname: ROUTES.ROUTE_TRANSCRIPT_SUBRECORDINGS,
                state: {
                    object: row
                }
            }}>
                <button
                    type="button"
                    className='waves-effect waves-light btn mic-page-buttons'
                >
                    SubRecords
           </button>
            </Link>

        )
    }

    onClickTranscript(input) {
        this.props.onTranscriptCellCallback(input);
    }
    render() {
        const { objectList } = this.props

        return (
            <BootstrapTable
                data={objectList}
            >
                <TableHeaderColumn width="100" dataField="id" isKey={true} >
                    Id
                </TableHeaderColumn>
                <TableHeaderColumn width="200" dataField="uuid">
                    UUID
                </TableHeaderColumn>
                <TableHeaderColumn width="200" dataField="meeting_id">
                    MeetingId
                </TableHeaderColumn>
                <TableHeaderColumn width="200" dataField="createdAt" >
                    CreatedAt
                </TableHeaderColumn>
                <TableHeaderColumn width="200" dataField="updatedAt">
                    UpdatedAt
                </TableHeaderColumn>
                <TableHeaderColumn width="200" dataField="converted">
                    Converted?
                </TableHeaderColumn>
                {/* <TableHeaderColumn width="200" dataField="play"
                    dataFormat={this.onPlayCell.bind(this)}>Play</TableHeaderColumn> */}
                {/* <TableHeaderColumn width="200" dataField="download"
                    dataFormat={this.onDownloadCell.bind(this)}>Download</TableHeaderColumn> */}
                <TableHeaderColumn width="200" dataField="transcript"
                    dataFormat={this.onTranscriptCell.bind(this)}>
                    Transcript
                    </TableHeaderColumn>
                {/* <TableHeaderColumn width="200" dataField="subrecords"
                    dataFormat={this.onSubRecordsCell.bind(this)}>
                    Subrecords
                    </TableHeaderColumn> */}
                <TableHeaderColumn width="200" dataField="subrecords"
                    dataFormat={this.onDeleteCell.bind(this)}>
                    Delete
                </TableHeaderColumn>

            </BootstrapTable>
        );
    }
}


export default RecordsTableConverted;
