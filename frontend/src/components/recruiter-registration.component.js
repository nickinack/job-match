import axios from 'axios';
import React, { Component } from 'react';
import { Router, Route, Link, Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";

class recruiterRegister extends Component {

    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeBio = this.onChangeBio.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePhone = this.onChangePhone.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {

            name: '',
            email: '',
            bio: '',
            phone: '',
            password: ''
        }
    }

    onChangeName(e){
        this.setState({
            name: e.target.value
        });
    }

    onChangeEmail(e){
        this.setState({
            email: e.target.value
        });
    }

    onChangePassword(e){
        this.setState({
            password: e.target.value
        });
    }

    onChangeBio(e){
        this.setState({
            bio: e.target.value
        });
    }

    onChangePhone(e){
        this.setState({
            phone: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        
        const recruiter = {
            type: "Recruiter",
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            phone: this.state.phone,
            bio: this.state.bio
        }
        axios.post("http://localhost:5000/users/register", recruiter).then(result => { 
            console.log(result.data); 
            if(result.data ==  1) {alert('Success'); this.props.history.push('/login'); }
            else alert(result.data == 1);
        })
        .catch(error => console.log(error));
        console.log(recruiter);

    }

    render(){
        return (
            <div>
                <h3> Register Recruiter </h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Name: </label>
                        <input type="text" className="form-control" value={this.state.name} onChange={this.onChangeName} />
                    </div>

                    <div className="form-group">
                        <label>Email: </label>
                        <input type="email" className="form-control" value={this.state.email} onChange={this.onChangeEmail} />
                    </div>

                    <div className="form-group">
                        <label>Phone: </label>
                        <input type="text" className="form-control" value={this.state.phone} onChange={this.onChangePhone} />
                    </div>

                    <div className="form-group">
                        <label>Password: </label>
                        <input type="password" className="form-control" value={this.state.password} onChange={this.onChangePassword} />
                    </div>

                    <div className="form-group">
                        <label>Bio: </label>
                        <input type="textbox" className="form-control" value={this.state.bio} onChange={this.onChangeBio} />
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Create Recruiter" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }

};

export default withRouter(recruiterRegister);



