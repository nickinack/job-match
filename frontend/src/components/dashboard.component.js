import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from "react-router-dom";
import Button from 'react-bootstrap/Button'




class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.renderUser = this.renderUser.bind(this);
        this.state = {
            type: '',
            user: {},
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
            this.setState({type: 'Applicant'});
            axios
                .post("http://localhost:5000/users/decode" , TokenVerify)
                .then(result => {
                    this.setState({id: result.data.id});
                    if(!result.data.id)
                    {
                        alert('Not permitted');
                        this.props.history.push('/');
                    }
                    const url = "http://localhost:5000/applicants/" + result.data.id;
                    console.log(url);
                    axios
                        .post(url , TokenVerify)
                        .then(userdetails => {
                            this.setState({user: userdetails.data});
                            console.log(this.state.user.users.name);
                            this.setState({loading: false})
                        })
                        .catch(function(error) {
                            console.log(error);
                    });
            
                })
                .catch(function(error) {
                    console.log(error);
                });
        }

        else {
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
                console.log(url);
                axios
                    .post(url , TokenVerify)
                    .then(userdetails => {
                        this.setState({user: userdetails.data});
                        console.log(userdetails.data); 
                        this.setState({loading: false});
                    })
                    .catch(function(error) {
                        console.log(error);
                });
        
            })
            .catch(function(error) {
                console.log(error);
            });

        }
         
      }

      onUpdate(d) {
          if(this.state.type === 'Applicant')
            this.props.history.push({pathname: "/updateapplicant" });
          else if(this.state.type === 'Recruiter')
            this.props.history.push({pathname: "/updaterecruiter" });
      }

      renderUser() { 
        if(this.state.loading)
        {
            return(
                <div>Loading.....</div>
            )
        }
        else if(this.state.type === 'Applicant')
        {
            const skillitems = this.state.user.applicant.skills.map((d) => <li key={d}>{d}</li>);
            const langitems = this.state.user.applicant.languages.map((d) => <li key={d}>{d}</li>);
            const edu = this.state.user.applicant.education.map((d) => 
                <tr key={d}>
                    <td>{d.college}</td>
                    <td>{d.start_year}</td>
                    <td>{d.end_year}</td>
                </tr>

            );
            return (
            <div className="container">
            <h1>Hey! You are an applicant!</h1>
                <table className="table table-bordered">
                    <tbody>
                    <tr className="table-danger">Name: {this.state.user.users.name}</tr>
                    <tr className="table-danger">Email: {this.state.user.users.email}</tr>
                    <tr className="table-danger">Rating: {this.state.user.users.rating}</tr>
                    <tr className="table-danger">Skills: {skillitems}</tr>
                    <tr className="table-danger">Languages: {langitems}</tr>
                    <tr className="table-danger">Education: <table className="table table-bordered">{edu}</table> </tr>
                    </tbody>
                </table>
            <Button size="sm" variant="outline-primary" onClick={() => this.onUpdate()}>Update</Button>
            </div>
            );
        }
        else if(this.state.type === 'Recruiter')
        {
            return (
            <div className="container">
            <h1>Hey! You are a recruiter</h1>
            <table className="table table-bordered">
                <tbody>
                    <tr className="table-danger">Name: {this.state.user.users.name}</tr>
                    <tr className="table-danger">Email: {this.state.user.users.email}</tr>
                    <tr className="table-danger">Phone: {this.state.user.recruiter.phone}</tr>
                    <tr className="table-danger">Bio: {this.state.user.recruiter.bio}</tr>
                </tbody>
            </table>
            <Button size="sm" variant="outline-primary" onClick={() => this.onUpdate()}>Update</Button>
            </div>
            );
        }
      }
    
    render(){
        return (
            <div>
            {this.renderUser()}
            </div>
        )
    }

}

export default withRouter(Dashboard);