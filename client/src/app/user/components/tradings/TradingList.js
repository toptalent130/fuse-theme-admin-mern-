import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseUtils from '@fuse/utils';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TradingTable from './TradingTable';
import * as Actions from './store/actions';
import { removeContact, updateContact } from './store/actions'
import Button from '@material-ui/core/Button';

import { useConfirm } from 'material-ui-confirm';

function TradingList(props) {
	const dispatch = useDispatch();
	const contacts = useSelector(({ tradingsApp }) => tradingsApp.contacts.entities);
	const users = useSelector(({ tradingsApp }) => tradingsApp.contacts.users);
	const plans = useSelector(({ tradingsApp }) => tradingsApp.contacts.plans);
	const robots = useSelector(({ tradingsApp }) => tradingsApp.contacts.robots);

	const searchText = useSelector(({ tradingsApp }) => tradingsApp.contacts.searchText);
	const user = useSelector(({ tradingsApp }) => tradingsApp.user);

	const [filteredData, setFilteredData] = useState(null);
	const confirm = useConfirm();

	const columns = React.useMemo(
		() => [
			{
				Header: 'No',
				accessor: 'no',
				className: 'font-bold',
				sortable: true
			},
			{
				Header: 'Manager',
				accessor: 'first_name',
				className: 'font-bold',
				sortable: true
			},
			{
				Header: 'Plan',
				accessor: 'plan_id',
				sortable: true
			},
			{
				Header: 'Robot',
				accessor: 'robot_id',
				sortable: true
			},
			{
				Header: 'Account Number',
				accessor: 'account_number',
				sortable: true
			},
			{
				Header: 'Created Time',
				accessor: 'created_time',
				sortable: true
			},
			{
				Header: 'Canceled Time',
				accessor: 'canceled_time',
				sortable: true
			},
			{
				Header: 'Edit',
				id: 'action-edit',
				width: 128,
				sortable: false,
				Cell: ({ row }) => {
					return (
						<div className="flex items-center" 
							onClick={() => {dispatch(Actions.openEditContactDialog(row.original))}}
						>
							<IconButton>
								<Icon>edit</Icon>
							</IconButton>
						</div>
					)
				}
			},
			{
				Header: 'Cancel',
				id: 'action-delete',
				width: 128,
				sortable: false,
				Cell: ({ row }) => {
					return (
						<div className="flex items-center"
							onClick={() => {
								let option = {
									title: <span style={{fontSize: '20px'}}>Are you sure?</span>,
									description: <span style={{fontSize: '16px'}}>This user will be premanently deleted!</span>,
									cancellationText: <span style={{fontSize: '16px'}}>No</span>,
									confirmationText: <span style={{fontSize: '16px'}}>Yes</span>,
									confirmationButtonProps: {variant: "contained", style: {margin: '0 10px 10px 0', background: 'rgb(20, 30, 60)'}},
									cancellationButtonProps: {variant: 'contained', style: {margin: '0 10px 10px 0', background: 'rgb(20, 30, 60)', color: 'white'}},
								}
								confirm(option).then(() => {
									//dispatch(Actions.removeContact({id: row.original.id}))
									let d = new Date();
									let time = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ':' +
											d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();
									dispatch(updateContact({...row.original, canceled_time: time}));
								}).catch (() => {
									console.log('error in confirm');
								});
							}}
						>
							<IconButton>
								<Icon>cancel</Icon>
							</IconButton>
						</div>
					)
				}
			}
		],
		[dispatch, user.starred]
	);

	useEffect(() => {
		function getFilteredArray(entities, _searchText) {
			const arr = Object.keys(entities).map(id => entities[id]);
			if (_searchText.length === 0) {
				return arr;
			}
			return FuseUtils.filterArrayByString(arr, _searchText);
		}

		if (contacts) {
			let data = contacts.map(ele => {
				for(let i=0; i<users.length; i++) {
					if(ele.manager_id === users[i].id) {
						return {...ele, first_name: users[i].first_name};
					}
				}
				return {...ele, first_name: "No User"};
			});
			
			setFilteredData(getFilteredArray(data, searchText));
		}
	}, [contacts, searchText]);

	if (!filteredData) {
		return null;
	}

	if (filteredData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					There are no trading licenses!
				</Typography>
			</div>
		);
	}

	return (
		<FuseAnimate animation="transition.slideUpIn" delay={300}>
			<TradingTable
				columns={columns}
				data={filteredData}
			/>
		</FuseAnimate>
	);
}

export default TradingList;
