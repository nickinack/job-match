import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/js/src/collapse.js";

export default class Navbar extends Component {
  
    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <Link to="/" className="navbar-brand"> Job Match </Link>
                <div className="collapse navbar-collapse">
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
                </div>
            </nav>
        );
    }
}