import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from "react-router-dom";
import StarRatings from 'react-star-ratings';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

class appViewJob extends Component {
    constructor(props) {
        super(props);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.renderApps = this.renderApps.bind(this);
        this.renderAppDetails = this.renderAppDetails.bind(this);
        this.onChangeSortBy = this.onChangeSortBy.bind(this);
        this.onChangeSortIn = this.onChangeSortIn.bind(this);
        this.clearSort = this.clearSort.bind(this);
        this.state = {
            loading: true,
            applicants: {},
            applications: {},
            users: {},
            sortby: '',
            sortin: 'asc',
            sorted_app: [],
            clear_sorted: 1,
            jobs: []
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
        console.log(User.token);
        const url = "http://localhost:5000/recruiters/accepted/viewall";
        axios.post(url , tokenVerify)
        .then(results => {
            if(results.data == 1 || results.data == 2) {
                alert('Not Data');
                this.props.history.push('/login');
            }

            else {
                this.setState({applicants: results.data.applicants});
                this.setState({applications: results.data.applications});
                this.setState({users: results.data.users});
                this.setState({jobs: results.data.jobs});
                this.setState({loading: false});
            }
        })

    }

    onChangeSortBy(e){
        this.setState({
            sortby: e
        })
    }

    onChangeSortIn(e){
        this.setState({
            sortin: e
        })
    }

    onClearSorted(e){
        this.setState({
            clear_sorted: 1
        })
    }

    async clearSort() {

        await this.setState({
            clear_sorted: 1
        });
        await this.setState({
            sorted_app: []
        })
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
                window.location.reload(false);
            }
        })
    }

    onSort(sortby, sortin){
        this.setState({loading: true});
        this.setState({sorted_app: this.state.applications});
        if(sortby === 'Rating')
        {
            if(sortin === "asc")
            {
                this.state.sorted_app.sort((a,b) =>  {
                    if(this.getApplicantDetails(a.applicant).rating > this.getApplicantDetails(b.applicant).rating) {return 1} 
                    else if(this.getApplicantDetails(a.applicant).rating < this.getApplicantDetails(b.applicant).rating) {return -1}
                    else return 0
                }   
                );
            }

            else if(sortin === "des")
            {
                this.state.sorted_app.sort((a,b) =>  {
                    if(this.getApplicantDetails(a.applicant).rating > this.getApplicantDetails(b.applicant).rating) {return -1} 
                    else if(this.getApplicantDetails(a.applicant).rating < this.getApplicantDetails(b.applicant).rating) {return +1}
                    else return 0
                }   
                );
            }
        }

        if(sortby === 'Date')
        {
            if(sortin === "asc")
            {
                this.state.sorted_app.sort((a1,b1) =>  {
                    const a = this.getJobDetails(a1.job).posting_date;
                    const b = this.getJobDetails(b1.job).posting_date;
                    if(this.formatDate(a.year , a.month , a.date) > this.formatDate(b.year , b.month , b.date)) {return 1} 
                    else if(this.formatDate(a.year , a.month , a.date) < this.formatDate(b.year , b.month , b.date)) {return -1}
                    else return 0
                }   
                );
            }

            else if(sortin === "des")
            {
                this.state.sorted_app.sort((a1,b1) =>  {
                    const a = this.getJobDetails(a1.job).posting_date;
                    const b = this.getJobDetails(b1.job).posting_date;
                    if(this.formatDate(a.year , a.month , a.date) > this.formatDate(b.year , b.month , b.date)) {return -1} 
                    else if(this.formatDate(a.year , a.month , a.date) < this.formatDate(b.year , b.month , b.date)) {return +1}
                    else return 0
                }   
                );
            }
        }

        if(sortby === 'Name')
        {
            if(sortin === "asc")
            {
                this.state.sorted_app.sort((a,b) =>  {
                    if(this.getApplicantDetails(a.applicant).name.toLowerCase() > this.getApplicantDetails(b.applicant).name.toLowerCase()) {return 1} 
                    else if(this.getApplicantDetails(a.applicant).name.toLowerCase() < this.getApplicantDetails(b.applicant).name.toLowerCase()) {return -1}
                    else return 0
                }   
                );
            }

            else if(sortin === "des")
            {
                this.state.sorted_app.sort((a,b) =>  {
                    if(this.getApplicantDetails(a.applicant).name.toLowerCase() > this.getApplicantDetails(b.applicant).name.toLowerCase()) {return -1} 
                    else if(this.getApplicantDetails(a.applicant).name.toLowerCase() < this.getApplicantDetails(b.applicant).name.toLowerCase()) {return 1}
                    else return 0
                }   
                );
            }
        }

        if(sortby === 'Title')
        {
            if(sortin === "asc")
            {
                this.state.sorted_app.sort((a,b) =>  {
                    if(this.getJobDetails(a.job).title.toLowerCase() > this.getJobDetails(b.job).title.toLowerCase()) {return 1} 
                    else if(this.getJobDetails(a.job).title.toLowerCase() < this.getJobDetails(b.job).title.toLowerCase()) {return -1}
                    else return 0
                }   
                );
            }

            else if(sortin === "des")
            {
                this.state.sorted_app.sort((a,b) =>  {
                    if(this.getJobDetails(a.job).title.toLowerCase() > this.getJobDetails(b.job).title.toLowerCase()) {return -1} 
                    else if(this.getJobDetails(a.job).title.toLowerCase() < this.getJobDetails(b.job).title.toLowerCase()) {return 1}
                    else return 0
                }   
                );
            }

        }
        this.setState({loading: false});
        this.setState({clear_sorted: 0});
    };

    formatDate(day , month , year)
    {
        return new Date(year,month, day,0,0,0);
    }

    getJobDetails(jobid){
        for(var i = 0 ; i < this.state.jobs.length ; i++)
        {
            console.log(jobid , this.state.jobs[i]._id);
            if(jobid == this.state.jobs[i]._id)
            {
                const jobDetails = {
                    posting_date: this.state.jobs[i].posting_date,
                    title: this.state.jobs[i].title,
                    type: this.state.jobs[i].type
                }
                return jobDetails;
            }
        }
       
    }

    renderAppDetails(d) {
        if(d.accept == 3)
        {
            return '';
        }
        const appl = this.getApplicantDetails(d.applicant);
        const skill_render = appl.skills.map((d) => <li>{d}</li>);
        const lang_render = appl.languages.map((d) => <li>{d}</li>);
        const edu_render = appl.education.map((d) =>
        <li>
        {d.college} {'  '}
        {d.start_year} {'  '}
        {d.end_year}
        </li>
        );
        const job_details = this.getJobDetails(d.job);
        console.log(job_details);
        const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        return (
        <table className="table table-bordered">
                    <tbody>
                    <tr className="table-danger">Name: {appl.name}</tr>
                    <tr className="table-danger">Email: {appl.email}</tr>
                    <tr className="table-danger">Date applied: {d.applied}</tr>
                    <tr className="table-danger">Type: {job_details.type} </tr>
                    <tr className="table-danger">Join Date: {job_details.posting_date.date} {monthNames[job_details.posting_date.month]}, {job_details.posting_date.year}</tr>
                    <tr className="table-danger">Title: {job_details.title} </tr>
                    <StarRatings rating={this.getApplicantDetails(d.applicant).rating} starRatedColor="blue" changeRating={this.changeRating} numberOfStars={5} name={this.getApplicantDetails(d.applicant).usrid}/>
                    </tbody>
        </table>
        );
    };

    renderApps(){

        if(this.state.loading || !this.state.applications)
        {
            console.log(localStorage.getItem("type"));
            return (
                <div>Loading ...</div>
            );
            
        }

        else if(localStorage.getItem("type") === 'Recruiter' && this.state.clear_sorted == 1)
        {
            const apps = this.state.applications.map((d) => 
            <div> {this.renderAppDetails(d)} </div>
            );
            return (
                <div>{apps}</div>
            );
        }

        else if(localStorage.getItem("type") === 'Recruiter' && this.state.clear_sorted == 0)
        {

            const apps = this.state.sorted_app.map((d) => 
            <div> {this.renderAppDetails(d)} </div>
            );
            return (
                <div>{apps}</div>
            );
        }
    }

    render() {

        return (
            <div>
                 <a className="btn btn-primary col px-md-5 p-3 border" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                    Filter
                </a>
                <div className="flex-row collapse" id="collapseExample">
                    <div className="d-flex flex-column p-4">
                        <div>
                            <label>Sort by: {this.state.sortby}</label>
                            <DropdownButton alignRight title="Sort by" id="dropdown" value={this.state.sortby} onSelect={this.onChangeSortBy} >
                                <Dropdown.Item eventKey="Rating">Rating</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="Name">Name</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="Date">Posting date</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="Title">Job Title</Dropdown.Item>
                            </DropdownButton>
                        </div>
                        <div>
                            <label>Sort in: {this.state.sortin}</label>
                            <DropdownButton alignRight title="Sort in" id="dropdown" value={this.state.sortin} onSelect={this.onChangeSortIn} >
                                <Dropdown.Item eventKey="asc">Ascending</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="des">Descending</Dropdown.Item>
                            </DropdownButton>
                        </div>
                        <div>
                            <label>Sort by title</label>
                        </div>
                        <div className="p-2">
                            <Button size="sm" variant="outline-primary" onClick={() => this.onSort(this.state.sortby , this.state.sortin)}>Sort</Button>
                        </div>
                    </div>
                </div>
                <div className="p-4 align-self-center">{this.renderApps()}</div>
            </div>
        )
    }

}

export default withRouter(appViewJob);