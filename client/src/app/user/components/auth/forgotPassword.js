import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import "./auth.css";
import { Link } from 'react-router-dom';
import { verifyPassword } from '../../actions/authActions';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { TextField, Button } from '@material-ui/core';
import Spinner  from '../common/Spinner';
class Forgot extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {},
      sendingEmail: false
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
    if (nextProps.auth.isAuthenticated) {
        this.props.history.push('/dashboard');
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if(nextProps.errors.email){
      this.setState({sendingEmail: false})
    }
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({sendingEmail: true});
    this.props.verifyPassword({email:this.state.email});
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    let content = (
      <div className="landing">
      <div className="dark-overlay">
          <div className="forgot container">
            <h1 className="text-4xl font-bold text-center">Reset Password</h1>
            <p className="text-center">
                Please enter your email address to reset your password.
            </p>
            <br/>
            <form onSubmit={this.onSubmit}>
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
              <Button
									variant="contained"
									color="primary"
									type="submit"
                  fullWidth
                  disabled={!(/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(this.state.email))}
								>
                  {this.state.sendingEmail 
                    ? <Spinner size='lg' spinning='spinning' /> 
                    : "Continue!"
                  }
							</Button>
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
    )
    if(errors.email_sent)
    {
      content = <div className="forgot container">
        <div className="logo text-center">
            <img src="/img/logo.png" alt="logo"/>
        </div>
        <h1 className="display-5 text-center" style={{color:'green'}}>Successfully Sent</h1>
        <br/>
        <p className="text-center" style={{color:'blue'}}>
            Please check your email box.
        </p>
      </div>;
      toast("Successfully sent");
    }
    return (
      <div className="landing">
        <div className="dark-overlay">
          <ToastContainer/>
          {content}
        </div>
      </div>
    );
  }
}

Forgot.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.user.auth,
  errors: state.user.errors
});

export default connect(mapStateToProps,{ verifyPassword})(Forgot);
