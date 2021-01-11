import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand"> Job Match </Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="navbar-item">
                            <Link to="/" className="nav-link">Introduction</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/register" className="nav-link">Register Applicant</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/applicant" className="nav-link">View Applicant</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/jobs" className="nav-link">View jobs</Link>
                        </li>
                    </ul> 
                </div>
            </nav>
        );
    }
}