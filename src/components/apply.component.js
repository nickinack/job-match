import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from "react-router-dom";

class Apply extends Component {
    constructor(props) {
        super(props);

        this.componentWillMount = this.componentWillMount.bind(this);
        this.onChangeSOP = this.onChangeSOP.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            jobid: '',
            applicantid: '',
            loading: true,
            sop: ''
        }
    }

    componentWillMount() {

        const User = {
            token: localStorage.getItem('token'),
            type: localStorage.getItem('type')
        }

        const TokenVerify = {
            token: localStorage.getItem('token')
        }

        const job = this.props.location.state;

        if(!User.token || !job || User.type !== 'Applicant')
        {
            alert('Not permitted');
            this.props.history.push('/login');
        }

        this.setState({jobid: job});

        axios.post("http://localhost:5000/users/decode" , TokenVerify)
        .then(res => {
            if(!res.data.id) {
                alert('Not permitted');
                this.props.history.push('/login');
            }

            else {
                this.setState({applicantid: res.data.id});
            }
        })
        .catch((error) => console.log(error));
    }

    onChangeSOP(e) {
        this.setState({
            sop: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const newApplication = {
            token: localStorage.getItem('token'),
            sop: this.state.sop
        }

        const joburl = "http://localhost:5000/jobs/" + this.state.jobid;
        axios.get(joburl)
        .then(jobs => {
            console.log("HEYYYYYY");
            const cur_date = new Date();
            console.log(cur_date);
            const cur_stamp = cur_date.getTime();
            const deadline_stamp = Date.parse(jobs.data.deadline);
            if(cur_stamp > deadline_stamp)
            {
                alert('Deadline Passed , cant apply');
                this.props.history.push('/dashboard');
            }

        })
        .catch(error => console.log(error));
        const url = "http://localhost:5000/applicants/applications/" + this.state.applicantid + "/" + this.state.jobid;
        console.log(url);
        axios.post(url , newApplication)
        .then(res => {
            alert(res.data);
            this.props.history.push('/jobview');   
        })
        .catch(error => console.log(error));
    }

    render() {

        return (
            <div>
            <form onSubmit={this.onSubmit}>

                <div className="form-group">
                    <label>Enter an SOP of not more than 250 words:</label>
                    <input type="textarea" className="form-control" value={this.state.sop} onChange={this.onChangeSOP} />
                </div>

                <div className="form-group">
                    <input type="submit" value="Apply" className="btn btn-danger" />
                </div>
            </form>
            </div>
        )
    }
}

export default withRouter(Apply);