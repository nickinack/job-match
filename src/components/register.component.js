import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'

import ApplicantRegister from "./applicant-registration.component";
import RecruiterRegister from "./recruiter-registration.component";


export default class Register extends Component {
    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);

        this.state = {
            option: ''
        }
    }

    onSelect(e) {
        console.log(e);
        this.setState({
            option: e
        });
    }


    render(){
        return (
            <div>
            <DropdownButton alignRight title="Register as" id="dropdown-menu-align-right" value={this.state.option} onSelect={this.onSelect} >
              <Dropdown.Item eventKey="Applicant">Applicant Registration</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey="Recruiter">Recruiter Registration</Dropdown.Item>
            </DropdownButton>

            {this.state.option === "" ? '' : (this.state.option === "Applicant" ? <ApplicantRegister/> : <RecruiterRegister/>)}
            </div>
        )
    }

}