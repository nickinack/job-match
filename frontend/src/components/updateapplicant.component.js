import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

class updateApplicant extends Component {
    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeLanguages = this.onChangeLanguages.bind(this);
        this.onChangeRating = this.onChangeRating.bind(this);
        this.onChangeEducation = this.onChangeEducation.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.skilladdClick = this.skilladdClick.bind(this);
        this.skillhandleChange = this.skillhandleChange.bind(this);
        this.skillremoveClick = this.skillremoveClick.bind(this);
        this.skillcreateUI = this.skillcreateUI.bind(this);
        this.languagecreateUI = this.languagecreateUI.bind(this);
        this.languagehandleChange = this.languagehandleChange.bind(this);
        this.languageremoveClick = this.languageremoveClick.bind(this);
        this.languageaddClick = this.languageaddClick.bind(this);
        this.educationaddClick = this.educationaddClick.bind(this);
        this.educationcreateUI = this.educationcreateUI.bind(this);
        this.educationhandleChange = this.educationhandleChange.bind(this);
        this.educationremoveClick = this.educationremoveClick.bind(this);

        this.state = {
            name: '',
            email: '',
            password: '',
            rating: 0,
            skills: [{skill: ''}],
            languages: [{language: ''}],
            education: [{college: "" , start_year: 0 , end_year: 0}],
            id: '',
            resume: '',
            imgencode: ''
        }
    }

    componentWillMount() {

        const TokenVerify = {
            token: localStorage.getItem('token')
        };

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
            axios
            .post(url , TokenVerify)
            .then(userdetails => {
                console.log(userdetails);
                this.setState({name: userdetails.data.users.name});
                this.setState({email: userdetails.data.users.email});
                this.setState({skills: userdetails.data.applicant.skills});
                this.setState({resume: userdetails.data.applicant.resume});
                this.setState({imgencode: userdetails.data.users.profile})
                var skill_set = []
                const len1 = userdetails.data.applicant.skills.length;
                if(len1 != 0 ) {
                    for(var i = 0 ; i < len1 ; i++)
                    {
                        skill_set.push({"skill": userdetails.data.applicant.skills[i]});
                    }
                    this.setState({skills: skill_set});
                }
                var lang_set = [];
                const len2 = userdetails.data.applicant.languages.length;
                if(len2 != 0 ) {
                    for(var i = 0 ; i < len2 ; i++)
                    {
                        lang_set.push({"language": userdetails.data.applicant.languages[i]});
                    }
                    this.setState({languages: lang_set});
                }
                this.setState({rating: userdetails.data.applicant.rating});
                this.setState({education: userdetails.data.applicant.education});
            })
            .catch(function(error) {
                console.log(error);
            });
        })
        .catch(function(error) {console.log(error)});

    }
    //Skills UI 
    skilladdClick(){
        this.setState(prevState => ({ 
            skills: [...prevState.skills, '']
        }))
    }

    skillhandleChange(i, e) {
        const { name , value } = e.target;
        let skills = [...this.state.skills];
        skills[i] = {...skills[i], [name]: value}; 
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
            languages: [...prevState.languages, '']
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
            education: [...prevState.education, {college: "" , start_year: 0 , end_year: 0}]
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
            <input placeholder="Start Year" name="start_year" className="form-control" value={el.start_year || this.state.education.start_year} onChange={this.educationhandleChange.bind(this, i)} />
            <input placeholder="End Year" name="end_year" className="form-control" value={el.end_year || this.state.education.start_year} onChange={this.educationhandleChange.bind(this, i)} />
            <input type='button' className="btn btn-secondary" value='remove' onClick={this.educationremoveClick.bind(this, i)}/>
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
        if(!this.state.password){ 
        alert('Enter old password/new password for update');
        window.location.reload(false)
        }
        e.preventDefault();
        const len = this.state.education.length;
        if(len != 0)
        {
            for(var i = 0 ; i < len ; i++)
            {
                this.state.education[i].start_year = this.state.education[i].start_year;
                this.state.education[i].end_year =  this.state.education[i].end_year;
            }
        }

        const skill_len = this.state.skills.length;
        var skill = [];
        if(skill_len != 0)
        {
            for(var i = 0 ; i < skill_len ; i++)
            {
                skill.push(this.state.skills[i].skill);
            }
        }
        var lang = [];
        const lang_len = this.state.languages.length;
        if(lang_len != 0)
        {
            for(var i = 0 ; i < lang_len ; i++)
            {
                console.log('In');
                lang.push(this.state.languages[i].language);
            }
        }
        const applicant = {
            id: this.state.id,
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            skills: skill,
            languages: lang,
            rating: this.state.rating,
            education: this.state.education,
            token: localStorage.getItem('token'),
            resume: this.state.resume,
            imgencode: this.state.imgencode
        }

        const url = "http://localhost:5000/applicants/update/" + this.state.id;
        axios.post(url, applicant).then(result => { 
            if(result.data == 1) {alert('Successful'); this.props.history.push('/dashboard');}
            else {console.log(result.data);}
        })
        .catch(error => console.log(error));
        console.log(applicant);
        
    }
    render() {
        return (
            <div>
      <h3>Update applicant</h3>
      <form onSubmit={this.onSubmit}>
        <div className="form-group"> 
          <label>Name: </label>
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
        

        {this.skillcreateUI()}
        <input type='button' value='add' className="btn btn-secondary pull-right" onClick={this.skilladdClick.bind(this)}/>

        {this.languagecreateUI()}
        <input type='button' value='add' className="btn btn-secondary pull-right" onClick={this.languageaddClick.bind(this)}/>

        {this.educationcreateUI()}
        <input type='button' value='add' className="btn btn-secondary pull-right" onClick={this.educationaddClick.bind(this)}/>

        <div className="form-group">
          <input type="submit" value="Update Applicant" className="btn btn-primary" />
        </div>
      </form>
    </div>
        )
    }
}


export default withRouter(updateApplicant);
