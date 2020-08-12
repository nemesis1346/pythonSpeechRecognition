import React from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

class RecordsTableNotConverted extends React.Component {
    constructor() {
        super();
        this.selectRowProp = {
            mode: "radio",
            clickToSelect: true,
            onSelect: this.onRowSelect
        };
        this.onClickConvert = this.onClickConvert.bind(this)
    }


    onClickConvert(object) {
        console.log('ON CLICK CONVERT');
        this.props.onClickConvertCallback(object);
    }

    onConvertCell(cell, row, enumObject, rowIndex) {
        return (
            <button
                type="button"
                className='waves-effect waves-light btn mic-page-buttons'
                onClick={() =>
                    this.onClickConvert(row)}
            >
                Convert
           </button>
        )
    }

    render() {
        return (
            <BootstrapTable
                data={this.props.objectList}
                selectRow={this.selectRowProp}
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
                <TableHeaderColumn dataField="convert" dataFormat={this.onConvertCell.bind(this)}>Convert</TableHeaderColumn>

            </BootstrapTable>
        );
    }
}

export default RecordsTableNotConverted;
