import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from "react-router-dom";
import jobaddComponent from './jobadd.component';
import StarRatings from 'react-star-ratings';


class viewApplication extends Component {
    constructor(props) {
        super(props);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.renderUser = this.renderUser.bind(this);
        this.getRecruiterDetails = this.getRecruiterDetails.bind(this);
        this.getJobDetails = this.getJobDetails.bind(this);
        this.state = {
            applications: {},
            jobs: {},
            recruiters: {},
            applicant: '',
            loading: true,
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

        if(User.type !== 'Applicant' || !User.token)
        {
            alert('Not Permitted');
            this.props.history.push('/login');
        }

        axios.post("http://localhost:5000/users/decode" , tokenVerify)
        .then(res => {
            if(!res.data.id) {
                alert('Not permitted');
                this.props.history.push('/login');
            }

            else {
                this.setState({applicant: res.data.id});
                const url = "http://localhost:5000/applicants/applications/" + res.data.id;
                axios.post(url , tokenVerify)
                .then(applications => {
                    if(applications.data == 1) {
                        alert('Not Permitted');
                        this.props.history.push('login');
                    }
                    else {
                        this.setState({applications: applications.data});
                        var jobsids = [];
                        const len = applications.data.length;
                        if(len != 0) {
                            for(var i = 0 ; i < len ; i++)
                            {
                                jobsids.push(applications.data[i].job);
                            }
                            const viewSome = {
                                token: localStorage.getItem("token"),
                                jobarr: jobsids
                            }
                            axios.post("http://localhost:5000/jobs/viewsome" , viewSome)
                            .then(results => {
                                if(res.data == 1) {
                                    alert('Not Permitted');
                                    this.props.history.push('login');
                                }
                                else {
                                this.setState({jobs: results.data.jobs});
                                this.setState({recruiters: results.data.recruiters});
                                this.setState({users: results.data.users});
                                this.setState({loading: false});
                                }
                            })
                            .catch((error) => console.log(error));
                        } 
                    }
                })
                .catch((error) => console.log(error));
            }
        })
        .catch((error) => console.log(error));
    }

    getUserDetails(recid){
        const len = this.state.users.length;
        if(len != 0)
        {
            for(var i = 0 ; i < len ; i++)
            {
                if(recid === this.state.users[i]._id)
                {
                    return this.state.users[i].name
                }
            }
        }
    }

    getRecruiterDetails(recid) {
        
        const len = this.state.recruiters.length;
        if(len != 0)
        {
            for(var i = 0 ; i < len ; i++)
            {
                if(recid === this.state.recruiters[i].usrid)
                {
                    const recDetails = {
                        phone: this.state.recruiters[i].phone,
                        bio: this.state.recruiters[i].bio,
                        name: this.getUserDetails(recid)
                    }
                    console.log(recDetails);
                    return recDetails;
                }
            }
        }
    }

    changeRating( newRating, name ) {
        const url = "http://localhost:5000/jobs/updateratings/" + name;
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
                window.location.reload(false);
            }
        })
    }

    getJobDetails(jobid) {

        const len = this.state.jobs.length;
        if(len != 0)
        {
            for(var i = 0 ; i < len ; i++)
            {
                if(jobid === this.state.jobs[i]._id)
                {
                    const jobDetails = {
                        recruiter: this.getRecruiterDetails(this.state.jobs[i].recruiter),
                        title: this.state.jobs[i].title,
                        rating: this.state.jobs[i].rating,
                        id: this.state.jobs[i]._id,
                        posting_date: this.state.jobs[i].posting_date,
                    }
                    return jobDetails
                }
            }
        }

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

    renderJoinDate(d){
        if(d.accept != 2)
        {
            return "Not Available";
        }
        else{
            const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
            console.log(this.getJobDetails(d.job).posting_date);
            return this.getJobDetails(d.job).posting_date.date + "  " + monthNames[this.getJobDetails(d.job).posting_date.month] + ", " + this.getJobDetails(d.job).posting_date.year;
        }
    }

    renderUser() { 
        if(this.state.loading)
        {
            return(
                <div>Loading.....</div>
            )
        }
        else
        {
            console.log(this.state.applications);
            const job = this.state.applications.map((d) => 
            <table className="table table-bordered">
                <tbody>
                <tr className="table-danger">Phone Number of Recruiter: {this.getJobDetails(d.job).recruiter.phone}</tr>
                <tr className="table-danger">Name of Recruiter: {this.getJobDetails(d.job).recruiter.name}</tr>
                <tr className="table-danger">Recruiter Bio : {this.getJobDetails(d.job).recruiter.bio}</tr>
                <tr className="table-danger">Title: {this.getJobDetails(d.job).title}</tr>
                <tr className="table-danger">Your SOP: <table><td>{d.sop}</td></table></tr>
                <tr className="table-danger">Joining date: {this.renderJoinDate(d)}</tr>
                <tr className="table-danger">Status: {this.getStatus(d.accept)}</tr>
                <StarRatings rating={this.getJobDetails(d.job).rating} starRatedColor="blue" changeRating={this.changeRating} numberOfStars={5} name={this.getJobDetails(d.job).id}/>
                </tbody>
            </table>
            );
            return (
                <div>
                    <h1>View Applications</h1>
                    <Container>{job}</Container>
                </div>
            );
        }
    }

    render() {

        return(
        <div>{this.renderUser()}</div>
        )
    }

}
export default withRouter(viewApplication);