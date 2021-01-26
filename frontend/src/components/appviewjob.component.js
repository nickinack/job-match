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
import emailjs from 'emailjs-com';
import{ init } from 'emailjs-com';
init("user_QxRnnsjaBgxr7GrTWtJ11");



class appViewJob extends Component {
    constructor(props) {
        super(props);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.renderApps = this.renderApps.bind(this);
        this.renderAppDetails = this.renderAppDetails.bind(this);
        this.onAccept = this.onAccept.bind(this);
        this.onReject = this.onReject.bind(this);
        this.onShortlist = this.onShortlist.bind(this);
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
            id: '',
            rec_name: ''
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
                this.setState({applicants: results.data.applicants});
                this.setState({applications: results.data.applications});
                this.setState({users: results.data.users});
                axios.post("http://localhost:5000/users/decode" , tokenVerify)
                .then(usr => {
                    this.setState({id: usr.data.id});
                    const url1 = "http://localhost:5000/recruiters/" + usr.data.id
                    axios.post(url1 , tokenVerify)
                    .then(user => {
                        this.setState({rec_name: user.data.users.name});
                    })
                    .catch((error) => console.log(error));
                })
                .catch((error) => console.log(error));
                this.setState({loading: false});
            }
        })
        .catch((error) => console.log(error));

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
                emailjs.send("service_isjur45","template_t2qvb4s",{
                    email: this.getApplicantDetails(d.applicant).email,
                    recruiter: this.state.rec_name
                })
                .then(emailed => console.log(emailed))
                .catch((error) => console.log(error));
                alert(result.data);
                window.location.reload(false);
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
                window.location.reload(false);
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
                console.log("In Here");
                alert(result.data);
                window.location.reload(false);
            }
        })
        .catch((error) => console.log(error));
    }

    onRenderButtons(d) {

        if(d.accept == 0)
        {
            return (
                <Container>
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
                ''
            )
        }
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
                        usrid: this.state.applicants[i].usrid,
                        resume: (this.state.applicants[i].hasOwnProperty('resume') ? this.state.applicants[i].resume : null)
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
                this.state.sorted_app.sort((a,b) =>  {
                    if(a.applied > b.applied) {return 1} 
                    else if(a.applied < b.applied) {return -1}
                    else return 0
                }   
                );
            }

            else if(sortin === "des")
            {
                this.state.sorted_app.sort((a,b) =>  {
                    if(a.applied > b.applied) {return -1} 
                    else if(a.applied < b.applied) {return +1}
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
                    if(this.getApplicantDetails(a.applicant).name.toLowerCase()> this.getApplicantDetails(b.applicant).name.toLowerCase()) {return 1} 
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
        this.setState({loading: false});
        this.setState({clear_sorted: 0});
    };

    checkresume(d) {
        console.log(this.getApplicantDetails(d.applicant))
        if(this.getApplicantDetails(d.applicant).resume)
        {
            if(this.getApplicantDetails(d.applicant).resume == 1)
            console.log("APPLICANT" , d.applicant);
            const path = 'file:///Users/karthik/Desktop/linkedin-clone/backend/public/' + d.applicant + '.pdf';
            return(<a href={path} download>Download</a>)     
        }
        return '';

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
        <tr>
        <td>{d.college} </td>
        <td>{d.start_year}</td>
        <td>{d.end_year} </td>
        </tr>
        );
        console.log(skill_render);
        return (
        <table className="table table-bordered">
                    <tbody>
                    <tr className="table-danger">Name: {appl.name}</tr>
                    <tr className="table-danger">Name: {appl.email}</tr>
                    <tr className="table-danger">Date applied: {d.applied}</tr>
                    <tr className="table-danger">SOP: <table><td>{d.sop}</td></table> </tr>
                    <tr className="table-danger">Skills: {skill_render}</tr>
                    <tr className="table-danger">Languages: {lang_render}</tr>
                    <tr className="table-danger">Education: {edu_render}</tr>
                    <tr className="table-danger">Status:  {this.getStatus(d.accept)}</tr>
                    {this.checkresume(d)}
                    {this.onRenderButtons(d)}
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
            console.log('Clear Sorted invoked');
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
                <div className="d-flex flex-row">
                    <div className="d-flex flex-column p-4">
                        <div>
                            <label>Sort by: {this.state.sortby}</label>
                            <DropdownButton alignRight title="Sort by" id="dropdown" value={this.state.sortby} onSelect={this.onChangeSortBy} >
                                <Dropdown.Item eventKey="Rating">Rating</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="Name">Name</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="Date">Application date</Dropdown.Item>
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
                        <div className="p-2">
                            <Button size="sm" variant="outline-primary" onClick={() => this.onSort(this.state.sortby , this.state.sortin)}>Sort</Button>
                        </div>
                    </div>
                </div>
                </div>

                <div className="p-4 align-self-center">{this.renderApps()}</div>
            </div>
        )
    }

}

export default withRouter(appViewJob);