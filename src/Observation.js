import React, { Component } from "react";
import Parser from 'html-react-parser';
import './Observation.css';

class Observation extends Component {
    constructor(props) {
      super(props);
      this.state = {
        patientDetails: ""
      };
    }

    componentDidUpdate(prevProps) {
      // Typical usage (don't forget to compare props):
      if (this.props.patientId !== prevProps.patientId) {
        //http://test.fhir.org/r3/Observation?patient._id=138&_format=json
        fetch(this.props.url + '/Observation?patient._id=' + this.props.patientId + '&_format=json&id=' )
          .then(async response => {
              const data = await response.json();
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response statusText
                  const error = (data && data.message) || response.statusText;
                  return Promise.reject(error);
              }
              if (data.total > 0) {
                let txt = ""
                for (let i =0; i <data.total; i++) {
                  txt += "<div class=\"ObservationEntry\">";
                  txt += data.entry[i].resource.text.div;
                  txt += "</div>"
                }
                this.setState({ patientDetails:  txt});
              } else {
                this.setState({ patientDetails: "Empty" });
              }
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