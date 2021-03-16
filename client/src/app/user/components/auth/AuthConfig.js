import Login from './Login';
import Register from './Register';
import Forgot from './forgotPassword';
import VerifyEmail from './VerifyEmail';
import ResetPass from './resetPassword';

const AuthConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				},
			}
		}
	},
	routes: [
		{
			path: '/login',
			component: Login
		},
		{
			path: '/register',
			component: Register
		},
		{
			path: '/forgot',
			component: Forgot
		},
		{
			path: '/verifyEmail',
			component: VerifyEmail
		},
		{
			path: '/confirmed/:id',
			component: Login
		},
		{
			path: '/confirmedpass/:id',
			component: ResetPass,	
		}

	]
};

export default AuthConfig;
