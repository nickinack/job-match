import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from "react-router-dom";
import StarRatings from 'react-star-ratings';
const jwt = require('jsonwebtoken');



class JobView extends Component {
    constructor(props) {
        super(props);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.renderJobs = this.renderJobs.bind(this);
        this.getRecruiter = this.getRecruiter.bind(this);
        this.onClickApp = this.onClickApp.bind(this);
        this.onClickRec = this.onClickRec.bind(this);
        this.state = {
            jobs: [],
            recruiters: [],
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
        // List all jobs
            axios.post("http://localhost:5000/jobs/viewall" , TokenVerify)
            .then(info => {
               this.setState({loading: false});
               this.setState({jobs: info.data.jobs});
               this.setState({recruiters: info.data.recruiters});
               console.log(info.data.recruiters);
               console.log(info.data.jobs);
            })
            .catch((error) => console.log(error));
         
        }
        if(User.type === 'Recruiter') {
            axios.post("http://localhost:5000/users/decode" , TokenVerify)
            .then(res => {
                console.log(res);
                if(!res.data.id) {
                    alert('Not permitted');
                    this.props.history.push('/');
                }
                else {
                    const url = "http://localhost:5000/recruiters/" + res.data.id + "/jobs";
                    axios.post(url , TokenVerify)
                    .then(jobs => {
                        this.setState({jobs: jobs.data});
                        this.setState({loading: false});
                        console.log(jobs.data[1]);
                    })
                    .catch((error) => console.log(error));
                }
            })
        }

    }

    renderSkills(skill) {
        const skills = skill.map((d1) => 
        <div key={d1}> {d1} </div>
        );

        return skills;
    }

    getRecruiter(id , attr) {
        
        const len = this.state.recruiters.length;
        if(len != 0)
        {
            for(var i = 0 ; i < len ; i++)
            {   
                if(id === this.state.recruiters[i].usrid)
                {
                    return this.state.recruiters[i].phone;
                }
            }

        }
    }
    
    onClickApp(d) {
        localStorage.setItem('jobid' , d._id);
        this.props.history.push({pathname: '/apply' , state: d._id});
    }

    onClickRec(d) {
        localStorage.setItem('jobid' , d._id);
        this.props.history.push({pathname: '/appviewjob' , state: d._id});
    }

    changeRating( newRating, name ) {
        console.log(newRating);
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

    renderJobApp(d) {
        return (
        <table className="table table-bordered">
                    <tbody>
                    <tr className="table-danger">Title: {d.title}</tr>
                    <tr className="table-danger">Deadline: {d.deadline}</tr>
                    <tr className="table-danger">Type: {d.type}</tr>
                    <tr className="table-danger">Duration: {d.duration} months</tr>
                    <tr className="table-danger"> Skills Required: 
                    {this.renderSkills(d.skills)}
                    </tr>
                    <tr className="table-danger"> Recruiter Contact: {this.getRecruiter(d.recruiter , 'phone')}</tr>
                    <StarRatings rating={d.rating} starRatedColor="blue" changeRating={this.changeRating} numberOfStars={5} name={d._id}/>
                    <a href="#"><div onClick={() => this.onClickApp(d)}>Apply</div></a>
                    </tbody>
        </table>
        );
    }

    renderJobRec(d) {
        return (
            <table className="table table-bordered">
                        <tbody>
                        <tr className="table-danger">Title: {d.title}</tr>
                        <tr className="table-danger">Deadline: {d.deadline}</tr>
                        <tr className="table-danger">Type: {d.type}</tr>
                        <tr className="table-danger">Duration: {d.duration} months</tr>
                        <tr className="table-danger"> Skills Required: 
                        {this.renderSkills(d.skills)}
                        </tr>
                        <tr className="table-danger">Max Applicants: {d.max_applicants}</tr>
                        <tr className="table-danger">Max Positions: {d.max_positions}</tr>
                        <a href="#"><div onClick={() => this.onClickRec(d)}>Look at applications</div></a>
                        </tbody>
            </table>
        );

    }

    renderJobs(){

        if(this.state.loading)
        {
            console.log(localStorage.getItem("type"));
            return (
                <div>Loading ...</div>
            );
            
        }

        else if(localStorage.getItem("type") === 'Applicant')
        {
            const job = this.state.jobs.map((d) => 
            <div> {d.active==1 ? this.renderJobApp(d) : '' } </div>
            );
            return (
                <Container>{job}</Container>
            );
        }

        else if(localStorage.getItem("type") === 'Recruiter')
        {

            const job = this.state.jobs.map((d) => 
            <div> {(d.active==1 || d.active==2) ? this.renderJobRec(d) : '' } </div>
            );
            return (
                <div>{job}</div>
            );
        }
    }
    
    render(){
        return (
            <div>
            {this.renderJobs()}
            </div>
        )
    }

}

export default withRouter(JobView);