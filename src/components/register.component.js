import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeLanguages = this.onChangeLanguages.bind(this);
        this.onChangeRating = this.onChangeRating.bind(this);
        this.onChangeEducation = this.onChangeEducation.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            name: '',
            email: '',
            password: '',
            rating: 0,
            skills: [{skill: ""}],
            languages: [{language: ""}],
            education: [{college: "" , date_scheme: {start_year: 0 , end_year: 0}}]
        }
    }
    //Skills UI 
    skilladdClick(){
        this.setState(prevState => ({ 
            skills: [...prevState.skills, {skill: '' }]
        }))
    }

    skillhandleChange(i, e) {
        const { name, value } = e.target;
        let skills = [...this.state.skills];
        if(e.target.name === "college"){
            skills[i] = {...skills[i], college: value}; 
        }
        this.setState({ skills });
    }

    skillremoveClick(i){
        let skills = [...this.state.skills];
        skills.splice(i, 1);
        this.setState({ skills });
    }

    skillcreateUI(){
        return this.state.skills.map((el, i) => (
          <div key={i} className="d-flex">
             <input placeholder="Skill" name="skill" className="form-control" value={el.skill ||''} onChange={this.skillhandleChange.bind(this, i)} />
             <input type='button' className="btn btn-secondary" value='remove' onClick={this.skillremoveClick.bind(this, i)}/>
          </div>          
        ))
    }

    //Language UI
    languageaddClick(){
        this.setState(prevState => ({ 
            languages: [...prevState.languages, {language: '' }]
        }))
    }

    languagehandleChange(i, e) {
        const { name, value } = e.target;
        let languages = [...this.state.languages];
        languages[i] = {...languages[i], [name]: value};
        this.setState({ languages });
    }

    languageremoveClick(i){
        let languages = [...this.state.languages];
        languages.splice(i, 1);
        this.setState({ languages });
    }

    languagecreateUI(){
        return this.state.languages.map((el, i) => (
          <div key={i} className="d-flex">
             <input placeholder="Language" name="language" className="form-control" value={el.language ||''} onChange={this.languagehandleChange.bind(this, i)} />
             <input type='button' className="btn btn-secondary" value='remove' onClick={this.languageremoveClick.bind(this, i)}/>
          </div>          
        ))
    }

    //Education UI
    educationaddClick(){
        this.setState(prevState => ({ 
            education: [...prevState.education, {college: "" , date_scheme: {start_year: 0 , end_year: 0}}]
        }))
    }

    educationhandleChange(i, e) {
        const { name, value } = e.target;
        let education = [...this.state.education];
        education[i] = {...education[i], [name]: value};
        this.setState({ education });
    }

    educationremoveClick(i){
        let education = [...this.state.education];
        education.splice(i, 1);
        this.setState({ education });
    }

    educationcreateUI(){
        return this.state.education.map((el, i) => (
          <div key={i} className="d-flex">
            Education {i}: 
            <input placeholder="College" name="college" className="form-control" value={el.college ||''} onChange={this.educationhandleChange.bind(this, i)} />
            <input placeholder="Start Year" name="start_year" className="form-control" value={el.date_scheme.start_year || ''} onChange={this.educationhandleChange.bind(this, i)} />
            <input placeholder="End Year" name="end_year" className="form-control" value={el.end_year || ''} onChange={this.educationhandleChange.bind(this, i)} />
            <input type='button' className="btn btn-secondary" value='remove' onClick={this.educationhandleChange.bind(this, i)}/>
          </div>          
        ))
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
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
    onChangeEducation(e) {
        this.setState({
            education: e.target.value
        });
    }
    onChangeLanguages(e) {
        this.setState({
            languages: e.target.value
        });
    }
    onChangeRating(e) {
        this.setState({
            rating: e.target.value
        });
    }
    onSubmit(e) {
        e.preventDefault();

        const applicant = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            skills: this.state.skills,
            languages: this.state.languages,
            rating: this.state.rating,
            education: this.state.education
        }

        console.log(applicant);
        axios.post('http://localhost:5000/applicants/add' , applicant)
        .then(res => console.log(res.data));
        
    }
    render() {
        return (
            <div>
      <h3>Create applicant</h3>
      <form onSubmit={this.onSubmit}>
        <div className="form-group"> 
          <label>name: </label>
          <input 
              type="text" 
              className="form-control"
              value={this.state.name}
              onChange={this.onChangeName}
              />
        </div>

        <div className="form-group"> 
          <label>Email: </label>
          <input  type="text"
              required
              className="form-control"
              value={this.state.email}
              onChange={this.onChangeEmail}
              />
        </div>

        <div className="form-group">
          <label>Password: </label>
          <input 
              type="text" 
              className="form-control"
              value={this.state.password}
              onChange={this.onChangePassword}
              />
        </div>

        <div className="form-group">
          <label>Rating: </label>
          <input 
              type="text" 
              className="form-control"
              value={this.state.rating}
              onChange={this.onChangeRating}
              />
        </div>
        
        {this.skillcreateUI()}
        <input type='button' value='add skill ' className="btn btn-secondary" onClick={this.skilladdClick.bind(this)}/>

        {this.languagecreateUI()}
        <input type='button' value='add language ' className="btn btn-secondary" onClick={this.languageaddClick.bind(this)}/>

        {this.educationcreateUI()}
        <input type='button' value='add education ' className="btn btn-secondary" onClick={this.educationaddClick.bind(this)}/>

        <div className="form-group">
          <input type="submit" value="Create Applicant" className="btn btn-primary" />
        </div>
      </form>
    </div>
        )
    }
}
