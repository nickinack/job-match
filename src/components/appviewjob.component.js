import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from "react-router-dom";
import Button from 'react-bootstrap/Button'

class appViewJob extends Component {
    constructor(props) {
        super(props);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.renderApps = this.renderApps.bind(this);
        this.renderAppDetails = this.renderAppDetails.bind(this);
        this.state = {
            loading: true,
            applicants: {},
            applications: {},
            users: {}
        }
    }

    componentWillMount() {

        const User = {
            token: localStorage.getItem('token'),
            type: localStorage.getItem('type')
        }

        const tokenVerify = {
            token: localStorage.getItem('token')
        }

        if(User.type !== 'Recruiter' || !User.token)
        {
            alert('Not Permitted');
            this.props.history.push('/login');
        }

        const jobid = this.props.location.state;
        console.log(jobid);
        if(!jobid)
        {
            this.props.history.push('/jobview');
        }
        const url = "http://localhost:5000/jobs/" + jobid + "/applications";
        axios.post(url , tokenVerify)
        .then(results => {
            if(results.data == 1) {
                alert('Not Permitted');
                this.props.history.push('/login');
            }

            else {
                console.log(results.data);
                this.setState({applicants: results.data.applicants});
                this.setState({applications: results.data.applications});
                this.setState({users: results.data.users});
                this.setState({loading: false});
            }
        })

    }

    onAccept() {
        console.log('Accept');
    }

    onShortlist() {
        console.log('Shortlist');
    }

    onReject() {
        console.log('Reject');
    }

    onRenderButtons(accept) {

        if(accept == 0)
        {
            return (
                <Container>
                <Button size="sm" variant="outline-primary" onClick={() => this.onAccept()}>Accept</Button>{' '}
                <Button size="sm" variant="outline-warning" onClick={() => this.onShortlist()}>Shortlist</Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={() => this.onReject()}>Reject</Button>
                </Container>
            )
        }

        if(accept == 1)
        {
            return (
                <Container>
                <Button size="sm" variant="outline-primary" onClick={() => this.onAccept()}>Accept</Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={() => this.onReject()}>Reject</Button>
                </Container>
            )
        }

        if(accept == 2)
        {
            return (
                <Container>Accepted!</Container>
            )
        }
    }

    getApplicantDetails(applicantid) {

        const len = this.state.applicants.length;
        if(len != 0) {
            for(var i = 0 ; i < len ; i++)
            {
                if(this.state.applicants[i].usrid === applicantid) {
                    const applicantDetails = {
                        skills: this.state.applicants[i].skills,
                        education: this.state.applicants[i].education,
                        languages: this.state.applicants[i].languages,
                        email: this.getUserDetails(applicantid , 'email'),
                        name: this.getUserDetails(applicantid , 'name')
                    }

                    console.log(applicantDetails);
                    return applicantDetails;
                }
            }
        }

    }

    getUserDetails(userid , attr) {
        const len = this.state.users.length;
        if(len != 0) {
            for(var i = 0 ; i < len ; i++)
            {
                if(this.state.users[i]._id === userid)
                {
                    if(attr === 'email')
                    {
                        return this.state.users[i].email;
                    }

                    if(attr === 'name')
                    {
                        return this.state.users[i].name;
                    }
                }
            }
        }
    }

    renderAppDetails(d) {
        if(d.accept == 3)
        {
            return '';
        }
        return (
        <table className="table table-bordered">
                    <tbody>
                    <tr className="table-danger">Name: {this.getApplicantDetails(d.applicant).name}</tr>
                    <tr className="table-danger">Job: {d.job}</tr>
                    <tr className="table-danger">SOP: {d.sop}</tr>
                    <tr className="table-danger">Status: {d.accept} </tr>
                    {this.onRenderButtons(d.accept)}
                    </tbody>
        </table>
        );
    }

    renderApps(){

        if(this.state.loading || !this.state.applications)
        {
            console.log(localStorage.getItem("type"));
            return (
                <div>Loading ...</div>
            );
            
        }

        else if(localStorage.getItem("type") === 'Recruiter')
        {

            const apps = this.state.applications.map((d) => 
            <div> {this.renderAppDetails(d)} </div>
            );
            return (
                <div>{apps}</div>
            );
        }
    }

    render() {

        return (
            <div>{this.renderApps()}</div>
        )
    }

}

export default withRouter(appViewJob);