import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from "react-router-dom";
const jwt = require('jsonwebtoken');



class Login extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            email: '',
            password: ''
        }
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const loginCred = {
            email: this.state.email,
            password: this.state.password
        }

        axios.post("http://localhost:5000/users/login", loginCred).then(result => { 
            const tokens = {
                token: result.data.token
             }; 
             console.log(result.data);
            if(result.data.token){
                localStorage.setItem("token" , result.data.token);
                localStorage.setItem("type" , result.data.user.type);
                this.props.history.push('/dashboard');
            }
            else{
                alert("Wrong Credentials");
                this.props.history.push('/');
            }
        })
        .catch(error => console.log(error));
        console.log(loginCred);
    }

    render(){
        return (
            <div>
            <form onSubmit={this.onSubmit}>

                <div className="form-group">
                    <label>Email:</label>
                    <input type="text" className="form-control" value={this.state.email} onChange={this.onChangeEmail} />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" className="form-control" value={this.state.password} onChange={this.onChangePassword} />
                </div>
                
                <div className="form-group">
                    <input type="submit" value="Login" className="btn btn-primary" />
                </div>
            </form>
            </div>
        )
    }

}

export default withRouter(Login);