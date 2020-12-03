import React, { Component } from "react";
import Parser from 'html-react-parser';
import _ from 'lodash';
import './Observation.css';

class Observation extends Component {
    constructor(props) {
      super(props);
      this.state = {
        patientDetails: ""
      };
    }

    async processData(response) {
      const data = await response.json();
      if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
      }
      if (data.total > 0) {
        let txt = ""
        for (let i =0; i <data.total; i++) {
          txt += "<div class=\"ObservationEntry\">";
          txt += _.get(data.entry[i], 'resource.text.div', '');
          txt += _.get(data.entry[i], 'resource.effectiveDateTime', '') + "<br/>";
          txt += _.get(data.entry[i], 'resource.code.text', '') + " : ";
          txt += _.get(data.entry[i], 'resource.valueQuantity.value', '') + " ";
          txt += _.get(data.entry[i], 'resource.valueQuantity.unit', '') + "<br/>";

          txt += "</div>"
        }
        this.setState({ patientDetails:  txt});
      } else {
        this.setState({ patientDetails: "Empty" });
      }
    }
    //http://ima_imaging_one:8080/fhir/Observation?patient._id=ce648e7a-d100-3cba-6557-3c5a744e13dd&_format=json
    componentDidUpdate(prevProps) {
      // Typical usage (don't forget to compare props):
      if (this.props.patientId !== prevProps.patientId) {
        //http://test.fhir.org/r3/Observation?patient._id=138&_format=json
        fetch(this.props.url + '/Observation?patient._id=' + this.props.patientId + '&_format=json' )
          .then(async response => {
              this.processData(response)
          })
          .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
          });
      }
    }

    render() {
        return (
          <div class="Observations"><b>Observations</b><br/>
            {Parser(this.state.patientDetails)}
          </div>
        )
    };
}

export default Observation;