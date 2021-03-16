import React from 'react';
import { Redirect } from 'react-router-dom';

const ServersAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/servers',
			component: React.lazy(() => import('./ServerApp'))
		},
	]
};

export default ServersAppConfig;
