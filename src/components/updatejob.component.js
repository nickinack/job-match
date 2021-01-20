import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from "react-router-dom";
const jwt = require('jsonwebtoken');



class updateJob extends Component {
    constructor(props) {
        super(props);
        this.onChangeDeadline = this.onChangeDeadline.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.onChangeMaxApplicants = this.onChangeMaxApplicants.bind(this);
        this.onChangeMaxPositions = this.onChangeMaxPositions.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
           max_applicants: '',
           max_positions: '',
           deadline: '',
           id: ''
        };
    }

    componentWillMount() {
        const job = this.props.location.state;
        console.log(job);
        if(!job){
            this.props.history.push('/viewjob');
        }
        this.setState({id: job});
    }

    onChangeDeadline(e) {
        this.setState({
            deadline: e.target.value
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

    onSubmit(e) {
        e.preventDefault();
        const updateDetails = {
            max_applicants: this.state.max_applicants,
            deadline: this.state.deadline,
            max_positions: this.state.max_positions,
            token: localStorage.getItem('token')
        }
        console.log(this.state);
        const url = "http://localhost:5000/jobs/update/" + this.state.id;
        axios.post(url,updateDetails)
        .then(result => {
            if(result.data == 1)
            {
                alert('Not permitted');
                this.props.history.push('/login');
            }
            else if(result.data == 2)
            {
                alert('Max Applicants is less than applications');
                this.props.history.push('/jobview');
            }
            else if(result.data == 3)
            {
                alert("Max Positions is less than accepted applicants");
                this.props.history.push('/jobview');
            }
            else {
                alert(result.data);
                this.props.history.push('/jobview');
            }
        })

    }

    render(){
        return (
            <div>
            <form onSubmit={this.onSubmit}>

                <div className="form-group">
                    <label>Max Applicants:</label>
                    <input type="text" className="form-control" value={this.state.max_applicants} onChange={this.onChangeMaxApplicants} />
                </div>

                <div className="form-group">
                    <label>Max Positions:</label>
                    <input type="text" className="form-control" value={this.state.max_positions} onChange={this.onChangeMaxPositions} />
                </div>

                <div className="form-group">
                    <label>Enter the Deadline for application</label>
                    <input type="datetime-local" className='form-control' value={this.state.deadline} onChange={this.onChangeDeadline} timeFormat={true} inputProps={{ placeholder: "Deadline" }}/>
                </div>
                
                <div className="form-group">
                    <input type="submit" value="Update" className="btn btn-primary" />
                </div>
            </form>
            </div>
        )
    }

}

export default withRouter(updateJob);