import React, { Component } from "react";
import Parser from 'html-react-parser';
import './PatientDetail.css';

class PatientDetail extends Component {
    constructor(props) {
      super(props);
      this.state = {
        patientDetails: ""
      };
    }

    componentDidUpdate(prevProps) {
      // Typical usage (don't forget to compare props):
      if (this.props.patientId !== prevProps.patientId) {
        fetch(this.props.url + '/Patient/' + this.props.patientId + '/' + '?_format=json' )
          .then(async response => {
              const data = await response.json();
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response statusText
                  const error = (data && data.message) || response.statusText;
                  return Promise.reject(error);
              }
              this.setState({ patientDetails: data.text.div });
          })
          .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
          });
      }
    }

    render() {
        return (
          <div class="details"><b>Narrative</b><br/>
            {Parser(this.state.patientDetails)}
          </div>
        )
    };
}

export default PatientDetail;