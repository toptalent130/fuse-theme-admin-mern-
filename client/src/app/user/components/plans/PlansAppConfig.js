import React from 'react';
import { Redirect } from 'react-router-dom';

const PlansAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/plans',
			component: React.lazy(() => import('./PlanApp'))
		},
	]
};

export default PlansAppConfig;
