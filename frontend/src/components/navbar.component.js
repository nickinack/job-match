import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/js/src/collapse.js";

export default class Navbar extends Component {
    constructor(props) {
        super(props);
    }

    
    renderifLoginApp() {
        return (
        <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </li>
            <li className="navbar-item">
                <Link to="/jobview" className="nav-link">View And Apply to jobs</Link>
            </li>
            <li className="navbar-item">
                <Link to="/viewapp" className="nav-link">View Applications</Link>
            </li>
            <li className="navbar-item">
                    <Link to="/" className="nav-link">Logout</Link>
            </li>
        </ul> 
        )
    }

    renderifLoginRec() {
        return(
        <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </li>
            <li className="navbar-item">
                <Link to="/jobadd" className="nav-link">Add a Job</Link>
            </li>
            <li className="navbar-item">
                <Link to="/jobview" className="nav-link">View Job And applications</Link>
            </li>
            <li className="navbar-item">
                <Link to="/viewaccepted" className="nav-link">View accepted applications</Link>
            </li>
            <li className="navbar-item">
                    <Link to="/" className="nav-link">Logout</Link>
            </li>
        </ul> 
        )
    }

    renderifNotLoggedIn() {
        return (
            <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                    <Link to="/" className="nav-link">Introduction</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/register" className="nav-link">Register</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/login" className="nav-link">Login</Link>
                </li>
             </ul> 
        )
    }

    render() {
        const isLoggedin = this.props.isLoggedIn;
        console.log(isLoggedin);
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <Link to="/" className="navbar-brand"> Job Match </Link>
                <div className="collapse navbar-collapse">
                  {isLoggedin ? ((localStorage.getItem('type') == 'Applicant') ? this.renderifLoginApp() : this.renderifLoginRec()) : this.renderifNotLoggedIn()}
                </div>
            </nav>
        );
    }
}

