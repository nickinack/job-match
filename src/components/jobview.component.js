import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from "react-router-dom";
const jwt = require('jsonwebtoken');



class JobApply extends Component {
    constructor(props) {
        super(props);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.renderUser = this.renderUser.bind(this);
        this.state = {
            type: '',
            user: {},
            loading: true,
        };
    }

    componentWillMount() {
        const User = {
          token: localStorage.getItem("token"),
          type:localStorage.getItem("type")
        };

        const TokenVerify = {
            token: localStorage.getItem("token")
        }
        
        if(!User.token)
        {
            alert('Not permitted');
            this.props.history.push('/');
        }

        if(User.type === 'Applicant'){
        // List all jobs
            axios.post("http://localhost:5000/jobs/viewall" , User.token)
            .then(res => {
               console.log(res);
            })
            .catch((error) => console.log(error));
         
      }
    }

      renderUser() { 

      }
    
    render(){
        return (
            <div>
            {this.renderUser()}
            </div>
        )
    }

}

export default withRouter(JobApply);