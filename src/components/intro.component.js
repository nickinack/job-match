import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import { Link } from 'react-router-dom';

export default class Intro extends Component {
    constructor(props) {
        super(props);
      }
      componentDidMount() {
        localStorage.clear();
      }
    render() {
        return (
            <div className="container">
                <h1>You or on introduction</h1>
                <h4>LinkedIn Clone: DASS Assignment-1</h4>
            </div>
        );
    }
}