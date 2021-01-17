import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from "react-router-dom";
import StarRatings from 'react-star-ratings';
import Button from 'react-bootstrap/Button'

class appViewJob extends Component {
    constructor(props) {
        super(props);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.renderApps = this.renderApps.bind(this);
        this.renderAppDetails = this.renderAppDetails.bind(this);
        this.onAccept = this.onAccept.bind(this);
        this.onReject = this.onReject.bind(this);
        this.onShortlist = this.onShortlist.bind(this);
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

    onAccept(d) {
        console.log('Accept');
        const url = 'http://localhost:5000/jobs/updateapplication/' + d._id;
        const details = {
            accept: 2,
            token: localStorage.getItem('token')
        }
        axios.post(url , details)
        .then(result => {
            if(result.data == 1) alert('Try again, something went wrong!');
            else{
                alert(result.data);
                this.props.history.push({pathname: '/jobview' , state: d._id});
            }
        })
        .catch((error) => console.log(error));
    }

    onShortlist(d) {
        console.log('Shortlist');
        const url = 'http://localhost:5000/jobs/updateapplication/' + d._id;
        const details = {
            accept: 1,
            token: localStorage.getItem('token')
        }
        axios.post(url , details)
        .then(result => {
            if(result.data == 1) alert('Try again, something went wrong!');
            if(result.data == 2) alert('Surpassed count for acceptance');
            else{
                alert(result.data);
                this.props.history.push({pathname: '/jobview' , state: d._id});
            }
        })
        .catch((error) => console.log(error));
    }

    onReject(d) {
        console.log('Reject');
        const url = 'http://localhost:5000/jobs/updateapplication/' + d._id;
        const details = {
            accept: 3,
            token: localStorage.getItem('token')
        }
        axios.post(url , details)
        .then(result => {
            if(result.data == 1) alert('Try again, something went wrong!');
            else{
                alert(result.data);
                this.props.history.push({pathname: '/jobview' , state: d._id});
            }
        })
        .catch((error) => console.log(error));
    }

    onRenderButtons(d) {

        if(d.accept == 0)
        {
            return (
                <Container>
                <Button size="sm" variant="outline-primary" onClick={() => this.onAccept(d)}>Accept</Button>{' '}
                <Button size="sm" variant="outline-warning" onClick={() => this.onShortlist(d)}>Shortlist</Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={() => this.onReject(d)}>Reject</Button>
                </Container>
            )
        }

        if(d.accept == 1)
        {
            return (
                <Container>
                <Button size="sm" variant="outline-primary" onClick={() => this.onAccept(d)}>Accept</Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={() => this.onReject(d)}>Reject</Button>
                </Container>
            )
        }

        if(d.accept == 2)
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
                        name: this.getUserDetails(applicantid , 'name'),
                        rating: this.state.applicants[i].rating,
                        usrid: this.state.applicants[i].usrid
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

    renderSkills(e) {

        const skillitems = this.getApplicantDetails(e).skills.map((d) => <li key={d}>{d}</li>);
        return skillitems;
        
    }

    renderLanguages(e) {
        const langitems = this.getApplicantDetails(e).languages.map((d) => <li key={d}>{d}</li>);
        return langitems;
    }

    getStatus(status) {

        if(status == 0)
            return 'Submitted!';
        else if(status == 1)
            return 'Shortlisted!';
        else if(status == 2)
            return 'Accepted!';
        else if(status == 3)
            return 'Rejected :(';
    }

    changeRating( newRating , name ) {
        console.log(name);
        const url = "http://localhost:5000/applicants/updateratings/" + name;
        const requirements = {
            token: localStorage.getItem('token'),
            rating: newRating
        };
        axios.post(url , requirements)
        .then(result => {
            if(result.data == 1)
            {
                alert('Not Authorized!');
                this.props.history.push('/login');
            }
            else if(result.data == 2)
            {
                alert('Already Rated');
            }
            else{
                alert('Successful!');
                console.log(result.data);
                window.location.reload(false);
            }
        })
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
                    <tr className="table-danger">Name: {this.getApplicantDetails(d.applicant).email}</tr>
                    <tr className="table-danger">Date applied: {Date(d.applied)}</tr>
                    <tr className="table-danger">SOP: {d.sop}</tr>
                    <tr className="table-danger">Skills: {this.renderSkills(d.applicant)}</tr>
                    <tr className="table-danger">Skills: {this.renderLanguages(d.applicant)}</tr>
                    <tr className="table-danger">Status: {this.getStatus(d.accept)} </tr>
                    <StarRatings rating={this.getApplicantDetails(d.applicant).rating} starRatedColor="blue" changeRating={this.changeRating} numberOfStars={5} name={this.getApplicantDetails(d.applicant).usrid}/>
                    {this.onRenderButtons(d)}
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