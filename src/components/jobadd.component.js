import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from "react-router-dom";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'

class Login extends Component {
    constructor(props) {
        super(props);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.onChangeDeadline = this.onChangeDeadline.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeDuration = this.onChangeDuration.bind(this);
        this.onChangePostingDate = this.onChangePostingDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeSalary = this.onChangeSalary.bind(this);
        this.onChangeMaxApplicants = this.onChangeMaxApplicants.bind(this);
        this.onChangeMaxPositions = this.onChangeMaxPositions.bind(this);
        this.state = {
            title: '',
            max_applicants: '',
            max_positions: '',
            recruiter: '',
            skills: [],
            type: '',
            posting_date: '',
            deadline: '',
            duration: 0,
            salary: ''
        }
    }

    componentWillMount() {

        const User = {
            token: localStorage.getItem('token'),
            type: localStorage.getItem('type')
        }

        const newToken = {
            token: localStorage.getItem('token')
        }

        if(User.type !== 'Recruiter')
        {
            alert('Not Recruiter!');
            this.props.history.push('/');
        }
        else {
            axios.post("http://localhost:5000/users/decode" , newToken)
            .then(res => {
                this.setState({recruiter: res.data.id});
                if(!res.data.id)
                {
                    alert("Session time out / Not permitted");
                    this.props.history.push('/');
                }
            })
        }
    }

    skilladdClick(){
        this.setState(prevState => ({ 
            skills: [...prevState.skills, '']
        }))
    }

    skillhandleChange(i, e) {
        const { name , value } = e.target;
        let skills = [...this.state.skills];
        skills[i] = {...skills[i],  [name]: value}; 
        console.log(skills);
        this.setState({ skills });
    }

    skillremoveClick(i){
        let skills = [...this.state.skills];
        skills.splice(i, 1);
        this.setState({ skills });
    }

    skillcreateUI(){
        return this.state.skills.map((el, i) => (
          <div key={i} className="d-flex">
             <input placeholder="Skill" name="skill" className="form-control" value={el.skill ||''} onChange={this.skillhandleChange.bind(this, i)} />
             <input type='button' className="btn btn-secondary" value='remove' onClick={this.skillremoveClick.bind(this, i)}/>
          </div>          
        ))
    }

    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        })
    }

    onChangeMaxApplicants(e) {
        this.setState({
            max_applicants: e.target.value
        })
    }

    onChangeMaxPositions(e) {
        this.setState({
            max_positions: e.target.value
        })
    }

    onChangeType(e) {
        this.setState({
            type: e
        })
    }

    onChangeDeadline(e) {
        this.setState({
            deadline: e.target.value
        })
    }

    
    onChangeSalary(e) {
        this.setState({
            salary: e.target.value
        })
    }

    onChangeDuration(e) {
        this.setState({
            duration: e
        });
    }

    onChangePostingDate(e) {
        this.setState({
            posting_date: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();
        console.log(this.state);
        const deadlineDate = new Date(this.state.deadline);
        const postingDate = new Date(this.state.posting_date);
        const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        const skill_len = this.state.skills.length;
        var skill = [];
        if(skill_len != 0)
        {
            for(var i = 0 ; i < skill_len ; i++)
            {
                skill.push(this.state.skills[i].skill);
            }
        }

        if(isNaN(Number(this.state.max_applicants)) || isNaN(Number(this.state.max_positions)))
        {
            alert('Enter numbers for Max Applicants/Max Positions');
            window.location.reload(false);
        }
        const newJob = {
            token: localStorage.getItem('token'),
            deadline: deadlineDate,
            posting_date: {date: postingDate.getDate() , month: postingDate.getMonth() , year: postingDate.getFullYear()},
            salary: this.state.salary,
            recruiter: this.state.recruiter,
            title: this.state.title,
            skills: skill,
            duration: this.state.duration,
            max_applicants: this.state.max_applicants,
            max_positions: this.state.max_positions,
            type: this.state.type
        }
        
        axios.post("http://localhost:5000/jobs/add" , newJob) 
        .then(result => {
            if(result.data == 1) { alert('Successful'); this.props.history.push('/dashboard'); }
            else {alert(result.data);}
        })
    }


    render(){
        return (
            <form onSubmit={this.onSubmit}>
                <h2> Add Job: </h2>
                <div className="form-group">
                    <label>Enter the title for the job: </label>
                    <input type="text" value={this.state.title} onChange={this.onChangeTitle} className='form-control' placeholder="Title" />
                </div>

                <div className="form-group">
                    <label>Enter the Deadline for application</label>
                    <input type="datetime-local" className='form-control' value={this.state.deadline} onChange={this.onChangeDeadline} timeFormat={true} inputProps={{ placeholder: "Deadline" }}/>
                </div>

                <div className="form-group">
                    <label>Enter the Maximum Number of Applicants</label>
                    <input type="text" value={this.state.max_applicants} onChange={this.onChangeMaxApplicants} className='form-control' placeholder="Max Applicants" />
                </div>

                <div className="form-group">
                    <label>Enter the Maximum Number of Positions</label>
                    <input type="text" value={this.state.max_positions} onChange={this.onChangeMaxPositions} className='form-control' placeholder="Max Positions" />
                </div>

                <div className="form-group">
                    <label>Enter the Salary per month</label>
                    <input type="text" value={this.state.salary} onChange={this.onChangeSalary} className='form-control' placeholder="Salary" />
                </div>

                <div className="form-group">
                    <label>Enter they type of the job: {this.state.type}</label>
                    <DropdownButton alignRight title="Type" id="dropdown" value={this.state.type} onSelect={this.onChangeType} >
                        <Dropdown.Item eventKey="Intern">Intern</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="Contract">Contract</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="Full-time">Full-time</Dropdown.Item>
                    </DropdownButton>
                </div>

                <div className="form-group">
                    <label>Enter the duration for the job; if its full time or contract, enter 0: {this.state.duration}</label>
                    <DropdownButton alignRight title="Type" id="dropdown" value={this.state.duration} onSelect={this.onChangeDuration} >
                        <Dropdown.Item eventKey="0">0</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="1">1</Dropdown.Item>
                        <Dropdown.Item eventKey="2">2</Dropdown.Item>
                        <Dropdown.Item eventKey="3">3</Dropdown.Item>
                        <Dropdown.Item eventKey="4">4</Dropdown.Item>
                        <Dropdown.Item eventKey="5">5</Dropdown.Item>
                        <Dropdown.Item eventKey="6">6</Dropdown.Item>
                    </DropdownButton>
                </div>

                <div className="form-group">
                    <label>Enter Skills: </label>
                    {this.skillcreateUI()}
                    <input type='button' value='add' className="btn btn-secondary pull-right" onClick={this.skilladdClick.bind(this)}/>
                </div>

                <div className="form-group">
                    <label>Enter Posting Date</label>
                    <input type="date" id="start" name="trip-start" value="2021-07-22" min="2020-01-01" max="2021-12-31" className="form-control" value={this.state.posting_date} onChange={this.onChangePostingDate} />
                </div>

                <div className="form-group">
                     <input type="submit" value="Add Job" className="btn btn-primary" />
                </div>
            </form>
        )
    }

}

export default withRouter(Login);