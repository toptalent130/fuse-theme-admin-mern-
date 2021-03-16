import React from 'react';
import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import AuthConfig from 'app/user/components/auth/AuthConfig';
import DashboardConfig from 'app/user/components/dashboard/DashboardConfig';
import ProfileConfig from 'app/user/components/profile/ProfileConfig';
import ContactsAppConfig from 'app/user/components/contacts/ContactsAppConfig';
import PlansAppConfig from 'app/user/components/plans/PlansAppConfig';
import RobotsAppConfig from 'app/user/components/robots/RobotsAppConfig';
import ServersAppConfig from 'app/user/components/servers/ServersAppConfig';
import AppsAppConfig from 'app/user/components/apps/AppsAppConfig';
import TradingsAppConfig from 'app/user/components/tradings/TradingsAppConfig';

const routeConfigs = [
	AuthConfig,
	DashboardConfig,
	ProfileConfig,
	ContactsAppConfig,
	PlansAppConfig,
	RobotsAppConfig,
	ServersAppConfig,
	AppsAppConfig,
	TradingsAppConfig,
];

const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs),
	{
		path: '/',
		component: () => <Redirect to="/login" />
	}
];

export default routes;
