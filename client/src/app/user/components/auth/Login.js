import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import "./auth.css";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { TextField, Button } from '@material-ui/core';
// import queryString from 'query-string';
class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {},
      sendingEmail: false,
      id: 0,
    };
    
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  
  componentDidMount() {
    if(this.props.match.params.id>0){
      this.setState({id:this.props.match.params.id});
    }
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if(nextProps.errors.state_email){
      toast(nextProps.errors.state_email);
    }
  }
  componentWillMount(){
    if(this.props.match.params.id){
      toast("Successfully verified. Please come via login");
    }
    if(this.props.errors.change_pass){
      toast(this.props.errors.change_pass);
    }
  }
  onSubmit(e) {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
      id: this.state.id
    };
    this.props.loginUser(userData);
  }
  
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  render() {
    const { errors } = this.state;
    return (
      <div className="landing">
        <ToastContainer/>
        <div className="dark-overlay">
          <div className="row" style={{display: 'flex'}}>
            <div className="welcome container text-center">
                <h1>
                    Welcome to Expert Invest
                </h1>
                <hr/>
                <p>
                  Powerful and professional admin template for Web Applications, CRM, CMS, Admin Panels and more.
                </p>
            </div>
            <div className="login container">
            <div className="logo text-center">
              <img src="/img/logo.png"  alt="logo" style={{display: 'inline-block'}}/>
            </div>
            <br/>
            <p className="text-center pb-4" style={{display: 'block', fontSize: '16px'}}>
              Log in to your account
            </p>
            <form  noValidate onSubmit={this.onSubmit} className="w-full">
              <div className="flex">
                <TextField
                  className="mb-24"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  variant="outlined"
                  error={errors.email}
                  fullWidth				
                  helperText={errors.email}
                />
              </div>
              <div className="flex">
                <TextField
                  className="mb-24"
                  label="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  variant="outlined"
                  error={errors.password}
                  helperText={errors.password}
                  fullWidth				
                />
              </div>
              <div>
								<Button
									variant="contained"
									color="primary"
									type="submit"
                  fullWidth
								>
                Let's Go!
								</Button>
							</div>
              <br/>
              <div style={{textAlign: 'center', marginTop: '10px'}}>
                <Link to="/forgot" style={{display: 'block'}}>
                  &nbsp; Forgot password?
                </Link>
              </div>
              <br/>
              <div className="text-center">
                Don't you have an account? &nbsp;
                <Link to="/register">
                    Register
                </Link>
              </div>
            </form>
          </div>
          </div>
          </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.user.auth,
  errors: state.user.errors
});

export default connect(mapStateToProps, { loginUser })(Login);
