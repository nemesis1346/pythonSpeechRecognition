import React from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

class ObjectTableConverted extends React.Component {
    constructor() {
        super();
        this.onClickPlay = this.onClickPlay.bind(this);
        this.onClickTranscript = this.onClickTranscript.bind(this)
        // this.onPlayCell=this.onPlayCell.bind(this)
        // this.onTranscriptCell=this.onTranscriptCell.bind(this)
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
                    // onClick={() => {
                    //     this.onClickTranscript(row)
                    // }}
                >
                    Transcript
           </button>
            </Link>


        )
    }

    onClickTranscript(input) {
        this.props.onTranscriptCellCallback(input);
    }
    render() {
        return (
            <BootstrapTable
                data={this.props.objectList}
            >
                <TableHeaderColumn width="200" dataField="id" isKey={true} >
                    Id
        </TableHeaderColumn>
                <TableHeaderColumn width="200" dataField="uuid">
                    UUID
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
                {/* <TableHeaderColumn dataField="play" dataFormat={this.onPlayCell.bind(this)}>Play</TableHeaderColumn> */}
                <TableHeaderColumn dataField="transcript" dataFormat={this.onTranscriptCell.bind(this)}>Transcript</TableHeaderColumn>
            </BootstrapTable>
        );
    }
}


export default ObjectTableConverted;
