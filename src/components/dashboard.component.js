import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from "react-router-dom";
const jwt = require('jsonwebtoken');



class Dashboard extends Component {
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

        if(User.type === 'Applicant') {
            this.setState({type: 'Applicant'});
            axios
                .post("http://localhost:5000/users/decode" , TokenVerify)
                .then(result => {
                    this.setState({id: result.data.id});
                    if(!result.data.id)
                    {
                        alert('Not permitted');
                        this.props.history.push('/');
                    }
                    const url = "http://localhost:5000/applicants/" + result.data.id;
                    console.log(url);
                    axios
                        .post(url , TokenVerify)
                        .then(userdetails => {
                            this.setState({user: userdetails.data});
                            console.log(this.state.user.users.name);
                            this.setState({loading: false})
                        })
                        .catch(function(error) {
                            console.log(error);
                    });
            
                })
                .catch(function(error) {
                    console.log(error);
                });
        }

        else {
            this.setState({type: 'Recruiter'});
            axios
            .post("http://localhost:5000/users/decode" , TokenVerify)
            .then(result => {
                this.setState({id: result.data.id});
                if(!result.data.id)
                {
                    alert('Not permitted');
                    this.props.history.push('/');
                }
                const url = "http://localhost:5000/recruiters/" + result.data.id;
                console.log(url);
                axios
                    .post(url , TokenVerify)
                    .then(userdetails => {
                        this.setState({user: userdetails.data});
                        console.log(userdetails.data); 
                        this.setState({loading: false});
                    })
                    .catch(function(error) {
                        console.log(error);
                });
        
            })
            .catch(function(error) {
                console.log(error);
            });

        }
         
      }

      renderUser() { 
        if(this.state.loading)
        {
            return(
                <div>Loading.....</div>
            )
        }
        else if(this.state.type === 'Applicant')
        {
            const skillitems = this.state.user.applicant.skills.map((d) => <li key={d}>{d}</li>);
            const langitems = this.state.user.applicant.languages.map((d) => <li key={d}>{d}</li>);
            const edu = this.state.user.applicant.education.map((d) => 
            <ul key={d}>
                <li>{d.college}</li>
                <li>{d.start_year}</li>
                <li>{d.end_year}</li>
            </ul>

            );
            return (
            <div className="container">
            <h1>Hey! You are an applicant!</h1>
            <div> Name: {this.state.user.users.name}</div>
            <div>Email: {this.state.user.users.email}</div>
            <div>Rating: {this.state.user.users.rating}</div>
            <div>Skills: {skillitems}</div>
            <div>Languages: {langitems}</div>
            <div>Education: {edu}</div>
            </div>
            );
        }
        else if(this.state.type === 'Recruiter')
        {
            return (
            <div className="container">
            <h1>Hey! You are a recruiter</h1>
            <div>Name: {this.state.user.users.name}</div>
            <div>Email: {this.state.user.users.email}</div>
            <div>Phone: {this.state.user.recruiter.phone}</div>
            <div>Bio: {this.state.user.recruiter.bio}</div>
            </div>
            );
        }
      }
    
    render(){
        return (
            <div>
            {this.renderUser()}
            </div>
        )
    }

}

export default withRouter(Dashboard);