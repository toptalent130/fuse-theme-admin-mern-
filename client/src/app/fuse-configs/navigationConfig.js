import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
	{
		id: 'dashboard-component',
		title: 'Dashboard',
		translate: 'DASHBOARD',
		type: 'item',
		icon: 'home',
		url: '/dashboard',
		permission: 1,
	},
	{
		id: 'users-component',
		title: 'Users',
		translate: 'USERS',
		type: 'item',
		icon: 'person',
		url: '/contacts',
		permission: 3,
	},
	{
		id: 'plans-component',
		title: 'Plans',
		translate: 'PLANS',
		type: 'item',
		icon: 'next_plan',
		url: '/plans',
		permission: 2,
	},
	{
		id: 'robots-component',
		title: 'Robot',
		translate: 'ROBOT',
		type: 'item',
		icon: 'adb',
		url: '/robots',
		permission: 2,
	},
	{
		id: 'servers-component',
		title: 'Server',
		translate: 'SERVER',
		type: 'item',
		icon: 'dns',
		url: '/servers',
		permission: 1,
	},
	{
		id: 'apps-component',
		title: 'App',
		translate: 'APP',
		type: 'item',
		icon: 'apps',
		url: '/apps',
		permission: 3,
	},
	{
		id: 'tradings-component',
		title: 'Trading licenses',
		translate: 'TRADING LICENSES',
		type: 'item',
		icon: 'build',
		url: '/tradings',
		permission: 2,
	}
];

export default navigationConfig;
