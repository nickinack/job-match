import axios from 'axios';
import React, { Component } from 'react';
import { Router, Route, Link, Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";

class recruiterUpdate extends Component {

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
            password: '',
            id: '',
            imgencode: ''
        }
    }

    componentWillMount() {
        const TokenVerify = {
            token: localStorage.getItem('token')
        };
        this.setState({type: 'Recruiter'});
            axios
            .post("http://localhost:5000/users/decode" , TokenVerify)
            .then(result => {
                this.setState({id: result.data.id});
                if(!result.data.id)
                {
                    alert('Not permitted');
                    this.props.history.push('/');
                }
                const url = "http://localhost:5000/recruiters/" + result.data.id;
                axios
                    .post(url , TokenVerify)
                    .then(userdetails => {
                        this.setState({name: userdetails.data.users.name});
                        this.setState({email: userdetails.data.users.email});
                        this.setState({phone: userdetails.data.recruiter.phone});
                        this.setState({bio: userdetails.data.recruiter.bio});
                        this.setState({imgencode: userdetails.data.users.profile})
                        console.log(userdetails.data); 
                    })
                    .catch(function(error) {
                        console.log(error);
                });
        
            })
            .catch(function(error) {
                console.log(error);
            });

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
        if(!this.state.password){ 
            alert('Enter old password/new password for update');
            window.location.reload(false);
        }

        const recruiter = {
            token: localStorage.getItem('token'),
            id: this.state.id,
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            phone: this.state.phone,
            bio: this.state.bio,
            imgencode: this.state.imgencode
        }
        const url = "http://localhost:5000/recruiters/update/" + this.state.id;
        axios.post(url , recruiter).then(result => { 
            if(result.data ==  1) {alert('Success'); this.props.history.push('/dashboard'); }
            else alert(result.data);
        })
        .catch(error => console.log(error));
        console.log(recruiter);

    }

    render(){
        return (
            <div>
                <h3> Update Recruiter Details </h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Name: </label>
                        <input type="text" className="form-control" value={this.state.name} onChange={this.onChangeName} />
                    </div>

                    <div className="form-group">
                        <label>Email: </label>
                        <input type="text" className="form-control" value={this.state.email} onChange={this.onChangeEmail} />
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
                        <input type="submit" value="Update Recruiter details" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }

};

export default withRouter(recruiterUpdate);



