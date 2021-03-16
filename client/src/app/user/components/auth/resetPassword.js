import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import "./auth.css";
import { Link } from 'react-router-dom';
import { newPassword } from '../../actions/authActions';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { TextField, Button } from '@material-ui/core';

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      password: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
        this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors.change_pass) {
        this.props.history.push('/login');
    }
    if (nextProps.auth.isAuthenticated) {
        this.props.history.push('/dashboard');
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
}
componentWillMount(){
    if(this.props.match.params.id){
        toast("Email verified, please enroll new password");
    }
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.newPassword({id: this.props.match.params.id, password: this.state.password});
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
          <div className="forgot container">
            <h1 className="text-4xl font-bold text-center">New Password</h1>
            <p className="text-center">
                Please enter your new password.
            </p>
            <br/>
            <form  noValidate onSubmit={this.onSubmit}>
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
                Confirm
								</Button>
							</div>
              <br/>
              <div className="text-center text-light">
                <Link to="/login">
                    Back to Login
                </Link>
              </div>
            </form>
          </div>
          </div>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  auth: PropTypes.object.isRequired,
  changePassword: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.user.auth,
  errors: state.user.errors
});

export default connect(mapStateToProps,{ newPassword })(ResetPassword);
