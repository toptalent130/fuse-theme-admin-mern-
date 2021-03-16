  import axios from 'axios';
  import setAuthToken from '../utils/setAuthToken';
  import jwt_decode from 'jwt-decode';
  import { SERVER_URL } from 'app/ApiConfig';

  import { 
    GET_ERRORS, 
    SET_CURRENT_USER, 
    USER_PROPILE_UPDATE,
    SET_DISPLAY_UPDATE_TOAST,
    USER_PASSWORD_UPDATE,
    SET_DISPLAY_UPDATE_PASSWORD,
   } from './types';

  // Register User
  export const registerUser = (userData, history) => dispatch => {
    axios
      .post(`${SERVER_URL}/api/users/register`, userData)
      .then((res) => history.push('/login'))
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  };

  // Login - Get User Token
  export const loginUser = userData => dispatch => {
    axios
      .post(`${SERVER_URL}/api/users/login`, userData)
      .then(res => {
        // Save to localStorage
        const { token } = res.data;
        // Set token to ls
        localStorage.setItem('jwtToken', token);
        // Set token to Auth header
        setAuthToken(token);
        // Decode token to get user data
        const decoded = jwt_decode(token);
        // Set current user
        dispatch(setCurrentUser(decoded));
      })
      .catch(err =>{
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })}
      );
  };
  export const verifyEmail = userData => dispatch => {
    axios
      .post(`${SERVER_URL}/api/users/verify_email`, userData)
      .then(res => {
      })
      .catch(err =>{
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })}
      );
  };
  export const verifyPassword = userData => dispatch => {
    axios
      .post(`${SERVER_URL}/api/users/verify_password`, userData)
      .then(res => {
      })
      .catch(err =>{
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })}
      );
  };
  export const changePassword = userData => dispatch => {
    axios
      .post(`${SERVER_URL}/api/users/change_password`, userData)
      .then(res => {
      })
      .catch(err =>{
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })}
      );
  };
  export const newPassword = userData => dispatch => {
    axios
      .post(`${SERVER_URL}/api/users/new_password`, userData)
      .then(res => {
      })
      .catch(err =>{
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })}
      );
  };
  // Set logged in user
  export const setCurrentUser = decoded => {
    return {
      type: SET_CURRENT_USER,
      payload: decoded
    };
  };

  // Log user out
  export const logoutUser = (history) => dispatch => {
    // Remove token from localStorage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('examid');
    localStorage.removeItem('pass');
    // Remove auth header for future requests
    setAuthToken(false);
    document.location.href = '/';
    // Set current user to {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
  };

export const updateUserProfile = (userData) => dispatch => {
  axios
    .post(`${SERVER_URL}/api/users/update_profile`, userData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(res => {
      if(res.data.success !== undefined && res.data.success) {

        localStorage.setItem('jwtToken', res.data.token);
        setAuthToken(res.data.token);

        dispatch({
          type: USER_PROPILE_UPDATE,
          payload: res.data.data,
        });
      }
    })
    .catch(err =>{
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })}
    );
}
export const updateUserPassword = (userData) => dispatch => {
  axios
    .post(`${SERVER_URL}/api/users/change_password`, userData)
    .then(res => {
      if(res.data.success){
        dispatch({
          type: USER_PASSWORD_UPDATE,
          payload: userData,
        });
      }
      else {
        dispatch({
          type: SET_DISPLAY_UPDATE_PASSWORD,
          payload: true,
        });
      }
    })
  
  }

export function setDisplayUpdateToast(data) {
  return {
    type: SET_DISPLAY_UPDATE_TOAST,
    payload: data,
  }
}
