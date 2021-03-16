import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseUtils from '@fuse/utils';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RobotTable from './RobotTable';
import * as Actions from './store/actions';
import { removeContact } from './store/actions'
import Button from '@material-ui/core/Button';

import { useConfirm } from 'material-ui-confirm';

function RobotList(props) {
	const dispatch = useDispatch();
	const contacts = useSelector(({ robotsApp }) => robotsApp.contacts.entities);
	const users = useSelector(({robotsApp}) => robotsApp.contacts.users);
	const searchText = useSelector(({ robotsApp }) => robotsApp.contacts.searchText);
	//const user = useSelector(({ robotsApp }) => robotsApp.user);

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
				Header: 'Active',
				accessor: 'active',
				className: 'font-bold',
				sortable: true
			},
			{
				Header: 'Manager',
				accessor: 'manager_name',
				sortable: true
			},
			{
				Header: 'Description',
				accessor: 'description',
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
				id: 'action-cancel',
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
									dispatch(Actions.updateContact({...row.original, active: 0}));
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
		[dispatch]
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
			let displayData = contacts.map(ele => {
				let status;
				if(ele.active) status = 'active';
				else status = 'inactive';
				for(let i=0; i<users.length; i++) {
					if(ele.manager_id === users[i].id) {
						return {...ele, manager_name: users[i].first_name, active: status};
					}
				}
				return {...ele, manager_name: "No Manager", active: status};
			});
			setFilteredData(getFilteredArray(displayData, searchText));
		}
	}, [contacts, searchText]);

	if (!filteredData) {
		return null;
	}

	if (filteredData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					There are no robots!
				</Typography>
			</div>
		);
	}
	return (
		<FuseAnimate animation="transition.slideUpIn" delay={300}>
			<RobotTable
				columns={columns}
				data={filteredData}
			/>
		</FuseAnimate>
	);
}

export default RobotList;
