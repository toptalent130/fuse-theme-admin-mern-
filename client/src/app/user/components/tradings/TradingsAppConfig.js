import React from 'react';
import { Redirect } from 'react-router-dom';

const TradingsAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/tradings',
			component: React.lazy(() => import('./TradingApp'))
		},
	]
};

export default TradingsAppConfig;
