import React from 'react';
import { Redirect } from 'react-router-dom';

const AppsAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps',
			component: React.lazy(() => import('./AppApp'))
		},
	]
};

export default AppsAppConfig;
