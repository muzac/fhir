import React, { Component } from "react";
import ReactDOM from "react-dom";
import './InitialForm.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import Parser from 'html-react-parser';

class InitialForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        name: 'http://test.fhir.org/r3',
        columnDefs: [
          {headerName: "ID", field: "id", width: 70},
          {headerName: "Name", field: "name"},
          {headerName: "Surname", field: "surname"},
          {headerName: "DOB", field: "dob"},
          {headerName: "Gender", field: "gender",width: 50}
        ],
        rowData: [
        ],
        showPatients: false,
        showPatientDetailsId: -1
      };
    }

    changeText(event) {
        this.setState({
        name: event.target.value
      });
    }

    // http://test.fhir.org/r3/Patient?id=10&_format=json
    // http://test.fhir.org/r3/Patient/10/?_format=json
    // https://vonk.fire.ly
    // http://test.fhir.org/r3
    handleClick() {
      fetch(this.state.name + '/Patient?_format=json')
        .then(async response => {
            const data = await response.json();
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response statusText
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            this.setState({ showPatients: true });

            let newRowData = [];
            data.entry.forEach(element => {
                let n = "";
                let s = "";
                if (element.resource !== undefined && element.resource.name !== undefined && element.resource.name.length > 0) {
                  s = element.resource.name[0].family;
                  n = element.resource.name[0].given;
                }
                let newEntry = { id:element.resource.id, surname: s, name: n, dob: element.resource.birthDate, gender:element.resource.gender}
                newRowData.push(newEntry);
            });

            this.setState({rowData: newRowData})
        })
        .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
    }

    handlePatientRowClick(rowIndex) {
      console.log("row clicked", this.state.rowData[rowIndex].id);
      fetch(this.state.name + '/Patient/' + this.state.rowData[rowIndex].id + '/' + '?_format=json&id=' )
        .then(async response => {
            const data = await response.json();
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response statusText
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            this.setState({ showPatientDetailsId: data.text.div });
        })
        .catch(error => {
          this.setState({ errorMessage: error.toString() });
          console.error('There was an error!', error);
      });
    }

    render() {
      return (
        <div>
          <div>
            <label class="label" htmlFor="name">FHIR Server </label>
            <input class="input" type="text" id="name" value={this.state.name} onChange={this.changeText.bind(this)}/>
            <button class="button" onClick={this.handleClick.bind(this)}>GO</button>
          </div>
          { this.state.showPatients ? <div className="ag-theme-balham"
            style={{
              height: '500px',
              width: '100%'
            }}><AgGridReact
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}
              onRowClicked={(e) => this.handlePatientRowClick(e.rowIndex) }>
            </AgGridReact>
          </div> : null }
          { this.state.showPatientDetailsId !== -1 ? <div class="details">{Parser(this.state.showPatientDetailsId)}
          </div> : null }
        </div>
      );
    }
}

export default InitialForm;