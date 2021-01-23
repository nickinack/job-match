import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from "react-router-dom";
import StarRatings from 'react-star-ratings';
import Button from 'react-bootstrap/Button'
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Fuse from 'fuse.js';


class JobView extends Component {
    constructor(props) {
        super(props);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.renderJobs = this.renderJobs.bind(this);
        this.getRecruiter = this.getRecruiter.bind(this);
        this.onClickApp = this.onClickApp.bind(this);
        this.onClickRec = this.onClickRec.bind(this);
        this.onChangeFilterDuration = this.onChangeFilterDuration.bind(this);
        this.onChangeFilterSalaryMax = this.onChangeFilterSalaryMax.bind(this);
        this.onChangeFilterType = this.onChangeFilterType.bind(this);
        this.onChangeFilterSalaryMin = this.onChangeFilterSalaryMin.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.onFuzzy = this.onFuzzy.bind(this);
        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.onChangeSortBy = this.onChangeSortBy.bind(this);
        this.onChangeSortIn = this.onChangeSortIn.bind(this);
        this.state = {
            jobs: [],
            recruiters: [],
            loading: true,
            filter_salary_max: 1000000,
            filter_salary_min: 0,
            filter_type: '',
            filter_duration: 7,
            filtered_job: [],
            no_results: 0,
            applications: [],
            id: '',
            search_title: '',
            occurences: [],
            sortby: '',
            sortin: 'asc'
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
               this.setState({jobs: info.data.jobs});
               this.setState({recruiters: info.data.recruiters});
               axios.post("http://localhost:5000/users/decode" , TokenVerify)
               .then(result => {
                    this.setState({id: result.data.id});
                    if(!result.data.id)
                    {
                        alert('Not permitted');
                        this.props.history.push('/');
                    }
                    const url = "http://localhost:5000/applicants/applications/" + result.data.id
                    axios.post(url , TokenVerify)
                    .then(applications => {
                        if(applications.data == 1)
                        {
                            alert('Not permitted');
                            this.props.history.push('/login');
                        }
                        this.setState({applications: applications.data});
                        var jobids = [];
                        for(var i = 0 ; i < info.data.jobs.length ; i++)
                        {
                            jobids.push(info.data.jobs[i]._id);
                        }

                        const job = {
                            id: jobids
                        }

                        axios.post("http://localhost:5000/jobs/applications/countall" , job)
                        .then(applications => {
                            var job_occurences = [];
                            for(var i = 0 ; i < applications.data.length ; i++)
                            {
                                job_occurences.push(applications.data[i].job);
                            }
                            this.setState({occurences: job_occurences});
                        })
                        this.setState({loading: false});
                    })
                    .catch((error) => console.log(error));
               })
               .catch((error) => console.log(error));

            })
            .catch((error) => console.log(error));
         
        }
        if(User.type === 'Recruiter') {
            axios.post("http://localhost:5000/users/decode" , TokenVerify)
            .then(res => {
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
                    })
                    .catch((error) => console.log(error));
                }
            })
        }

    }

    async onFuzzy() {
        var res = []
        if(this.state.filtered_job.length == 0)
        {
            const fuse = new Fuse(this.state.jobs, {
                keys: ['title']
            });

            res = fuse.search(this.state.search_title);
        }
        else 
        {
            const fuse = new Fuse(this.state.filtered_job, {
                keys: ['title']
            });

            res = fuse.search(this.state.search_title);
        }

        var ans = [];
        for(var i = 0 ; i < res.length ; i++ )
        {
            ans.push(res[i].item);
        }
        await this.setState({filtered_job: ans});
    }

    onChangeSearchTitle(e) {
        this.setState({
            search_title: e.target.value
        })
    }

    onChangeFilterSalaryMax(e){
        this.setState({
            filter_salary_max: e.target.value
        });
    }

    onChangeFilterSalaryMin(e){
        this.setState({
            filter_salary_min: e.target.value
        });
    }
    
    onChangeFilterType(e){
        this.setState({
            filter_type: e
        });
    }

    onChangeFilterDuration(e){
        this.setState({
            filter_duration: e
        });
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

    onClickDelete(d) {
        const TokenVerify = {
            token: localStorage.getItem("token")
        }
        const url = "http://localhost:5000/jobs/delete/" + d._id;
        axios.post(url , TokenVerify)
        .then(result => {
            if(result.data == 1) {
                alert('Not Permitted!');
                this.props.history.push('/login');
            }

            else {
                alert('Successfully Deleted!');
                window.location.reload(false);
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

    onClickUpdate(d) {
        this.props.history.push({pathname: '/updatejob' , state: d._id});
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

    alreadyApplied(jobid) {

        const len = this.state.applications.length;
        if(len != 0){
            for(var i = 0 ; i < len ; i++) {
                if(jobid === this.state.applications[i].job)
                {
                    return 1;
                }
            }
        }
        return 0;
    }

    renderApply(d){
        if(d.active == 1)
        {
            if(!this.alreadyApplied(d._id)) {
                return (
                    <Button size="sm" variant="outline-primary" onClick={() => this.onClickApp(d)}>Apply!</Button>
                )
            }
            else {
                return (<Button size="sm" variant="outline-warning">Applied!</Button>);
            }
        }
        if(d.active == 2)
        {
            return(<Button size="sm" variant="outline-danger">Full!</Button>)
        }
    }

    onCountOccurences(jobid)
    {
        var occurences = 0;
        for(var i = 0 ; i < this.state.occurences.length ; i++)
        {
            console.log(this.state.occurences[i] , jobid);
            if(this.state.occurences[i] === jobid)
            {
                occurences = occurences + 1;
            }
        }
        return occurences;
    }


    renderJobApp(d) {
        var cur_date = new Date();
        cur_date = cur_date.getTime();
        console.log(Date.parse(d.deadline) , cur_date , d.title);
        return (
            <div>
            <table className="table table-bordered">
            <tbody>
            <tr className="table-danger">Title: {d.title}</tr>
            <tr className="table-danger">Deadline: {d.deadline}</tr>
            <tr className="table-danger">Type: {d.type}</tr>
            <tr className="table-danger">Duration: {d.duration} months {d.duration == 0 ? '(Indefinite)' : ''}</tr>
            <tr className="table-danger">Salary: {d.salary}</tr>
            <tr className="table-danger">Rating: {d.rating}</tr>
            <tr className="table-danger">Max Applicants: {d.max_applicants}</tr>
            <tr className="table-danger">Remaining Positions: {d.max_positions - this.onCountOccurences(d._id)}</tr>
            <tr className="table-danger"> Skills Required: 
            {this.renderSkills(d.skills)}
            </tr>
            <tr className="table-danger"> Recruiter Contact: {this.getRecruiter(d.recruiter , 'phone')}</tr>
            {this.renderApply(d)}
            </tbody>
            </table>
            </div>
       
        );
    }


    renderJobRec(d) {
        return (
            <table className="table table-bordered">
                        <tbody>
                        <tr className="table-danger">Title: {d.title}</tr>
                        <tr className="table-danger">Deadline: {d.deadline}</tr>
                        <tr className="table-danger">Type: {d.type}</tr>
                        <tr className="table-danger">Duration: {d.duration} months  {d.duration == 0 ? '(Indefinite)' : ''}</tr>
                        <tr className="table-danger">Salary: {d.salary}</tr>
                        <tr className="table-danger">Rating: {d.rating}</tr>
                        <tr className="table-danger"> Skills Required: 
                        {this.renderSkills(d.skills)}
                        </tr>
                        <tr className="table-danger">Max Applicants: {d.max_applicants}</tr>
                        <tr className="table-danger">Max Positions: {d.max_positions}</tr>
                        <Button size="sm" variant="outline-primary" onClick={() => this.onClickRec(d)}>Look at applications</Button>{'  '}
                        <Button size="sm" variant="outline-danger" onClick={() => this.onClickDelete(d)}>Delete Job</Button>
                        <Button size="sm" variant="outline-warning" onClick={() => this.onClickUpdate(d)}>Update Job Details</Button>
                        </tbody>
            </table>
        );

    }

    async onFilter(min_salary , max_salary , duration , type){
        var filtering = []
        const sortin = this.state.sortin;
        const sortby = this.state.sortby;
        if(this.state.filtered_job.length != 0)
        {
            filtering = this.state.filtered_job;
        }
        else 
        {
            filtering = this.state.jobs;
        }

        if(!type) {
            await this.setState({filtered_job: filtering.filter(job => (job.salary > min_salary && job.salary < max_salary && job.duration < duration))});
        }
        else {
            await this.setState({filtered_job: filtering.filter(job => (job.salary > min_salary && job.salary < max_salary && job.type==type && job.duration < duration))});
        }

        if(this.state.filtered_job.length == 0)
        {
            await this.setState({no_results: 1});
        }
    
        if(sortby)
        {
            if(sortby === 'Rating')
            {
                if(sortin === "asc")
                {
                    this.state.filtered_job.sort((a,b) =>  {
                        if(a.rating > b.rating) {return 1} 
                        else if(a.rating < b.rating) {return -1}
                        else return 0
                    }   
                    );
                }
    
                else if(sortin === "des")
                {
                    this.state.filtered_job.sort((a,b) =>  {
                        if(a.rating > b.rating) {return -1} 
                        else if(a.rating < b.rating) {return 1}
                        else return 0
                    }   
                    );
                }
            }

            if(sortby === 'Duration')
            {
                console.log('DURAAAAAATIONNN');
                if(sortin === "asc")
                {
                    this.state.filtered_job.sort((a,b) =>  {
                        if(a.duration > b.duration) {return 1} 
                        else if(a.duration < b.duration) {return -1}
                        else return 0
                    }   
                    );
                }
    
                else if(sortin === "des")
                {
                    this.state.filtered_job.sort((a,b) =>  {
                        if(a.duration > b.duration) {return -1} 
                        else if(a.duration < b.duration) {return 1}
                        else return 0
                    }   
                    );
                }
            }

            if(sortby === 'Salary')
            {
                if(sortin === "asc")
                {
                    this.state.filtered_job.sort((a,b) =>  {
                        if(a.salary > b.salary) {return 1} 
                        else if(a.salary < b.salary) {return -1}
                        else return 0
                    }   
                    );
                }
    
                else if(sortin === "des")
                {
                    this.state.filtered_job.sort((a,b) =>  {
                        if(a.salary > b.salary) {return -1} 
                        else if(a.salary < b.salary) {return 1}
                        else return 0
                    }   
                    );
                }
            }
        }
    }

    async onClearFilter() {
        await this.setState({filtered_job: []});
        await this.setState({no_results: 0});
    }

    renderJobs(){
        var cur_date = new Date();
        cur_date = cur_date.getTime();
        if(this.state.loading)
        {
            return (
                <div>Loading ...</div>
            );
            
        }

        else if(localStorage.getItem("type") === 'Applicant' && this.state.filtered_job.length == 0 && this.state.no_results == 0)
        {
            const job = this.state.jobs.map((d) => 
            <div> {((d.active==1 || d.active==2) && Date.parse(d.deadline) > cur_date)? this.renderJobApp(d) : '' } </div>
            );
            return (
                <Container>{job}</Container>
            );
        }

        else if(localStorage.getItem("type") === 'Applicant' && (this.state.filtered_job.length != 0 || this.state.no_results == 1))
        {
            const job = this.state.filtered_job.map((d) => 
            <div> {((d.active==1 || d.active==2) && Date.parse(d.deadline) > cur_date) ? this.renderJobApp(d) : '' } </div>
            );
            return (
                <Container>{job}</Container>
            );
        }

        else if(localStorage.getItem("type") === 'Recruiter' && (this.state.filtered_job.length == 0 && this.state.no_results == 0))
        {

            const job = this.state.jobs.map((d) => 
            <div> {(d.active==1 || d.active==2) ? this.renderJobRec(d) : '' } </div>
            );
            return (
                <div>{job}</div>
            );
        }

        else if(localStorage.getItem("type") === 'Recruiter' && (this.state.filtered_job.length != 0 || this.state.no_results == 1))
        {
            const job = this.state.filtered_job.map((d) => 
            <div> {(d.active==1 || d.active==2) ? this.renderJobRec(d) : '' } </div>
            );
            return (
                <Container>{job}</Container>
            );
        }
    }
    
    render(){
        return (
            <div>
                <h1>View All Jobs: </h1>
                 <a className="btn btn-primary col px-md-5 p-3 border" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                    Filter
                </a>
                <div className="flex-row collapse" id="collapseExample">
                    <div className="p-2">
                        <div class="input-group">
                            <div class="form-outline">
                                <input type="search" id="form1" class="form-control" placeholder="Search" value={this.state.search_title} onChange={this.onChangeSearchTitle}/>
                            </div>
                            <Button size="sm" variant="outline-success" onClick={() => this.onFuzzy()}>Submit</Button>
                        </div>
                        <div className="d-flex flex-column">
                            <div>
                                <label>Enter Max Duration: {this.state.filter_duration}</label>
                                <DropdownButton alignRight title="Duration" id="dropdown" value={this.state.filter_duration} onSelect={this.onChangeFilterDuration} >
                                    <Dropdown.Item eventKey="1">1 (Shows Indefinite jobs)</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="2">2</Dropdown.Item>
                                    <Dropdown.Item eventKey="3">3</Dropdown.Item>
                                    <Dropdown.Item eventKey="4">4</Dropdown.Item>
                                    <Dropdown.Item eventKey="5">5</Dropdown.Item>
                                    <Dropdown.Item eventKey="6">6</Dropdown.Item>
                                    <Dropdown.Item eventKey="7">7</Dropdown.Item>
                                </DropdownButton>
                            </div>
                            <div className="d-flex flex-column">
                                <label>Enter Min Salary: {this.state.filter_salary_min}</label>
                                <input type="range" value={this.state.filter_salary_min} onChange={this.onChangeFilterSalaryMin} placeholder="Enter Salary" className="form-range" min="0" max="1000000" step="1000"/>
                            </div>
                            <div className="d-flex flex-column">
                                <label>Enter Max Salary: {this.state.filter_salary_max}</label>
                                <input type="range" value={this.state.filter_salary_max} onChange={this.onChangeFilterSalaryMax} placeholder="Enter Salary" className="form-range" min="0" max="1000000" step="1000"/>
                            </div>
                            <div>
                                <label>Type: {this.state.filter_type}</label>
                                <DropdownButton alignRight title="Type" id="dropdown" value={this.state.filter_type} onSelect={this.onChangeFilterType} >
                                    <Dropdown.Item eventKey="Full-time">Full-time</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="Contract">Contract</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="Intern">Intern</Dropdown.Item>
                                </DropdownButton>
                            </div>
                            <div>
                                    <label>Sort by: {this.state.sortby}</label>
                                    <DropdownButton alignRight title="Sort by" id="dropdown" value={this.state.sortby} onSelect={this.onChangeSortBy} >
                                        <Dropdown.Item eventKey="Rating">Rating</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item eventKey="Duration">Duration</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item eventKey="Salary">Salary</Dropdown.Item>
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
                            <Button size="sm" variant="outline-danger" onClick={() => this.onFilter(this.state.filter_salary_min , this.state.filter_salary_max , this.state.filter_duration, this.state.filter_type)}>Filter</Button>
                            <Button size="sm" variant="outline-success" onClick={() => this.onClearFilter()}>Clear</Button>
                        </div>
                    </div>
                </div>

                
                <div className="align-self-stretch">{this.renderJobs()}</div>
                
            </div>
            
        )
    }

}

export default withRouter(JobView);