import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import {
	updateContact,
	addContact,
	closeNewContactDialog,
	closeEditContactDialog
} from './store/actions';

import {FaRobot} from 'react-icons/fa';
import { GrPlan } from 'react-icons/gr';
import {AiOutlineFieldNumber} from 'react-icons/ai';
import {FaBusinessTime} from 'react-icons/fa';
import {MdTimerOff} from 'react-icons/md';

const defaultFormState = {
	manager_id: -1,
	plan_id: -1,
	robot_id: -1,
	account_number: '',
};

function TradingDialog(props) {
	const dispatch = useDispatch();
	const contactDialog = useSelector(({ tradingsApp }) => tradingsApp.contacts.contactDialog);
	const users = useSelector(({ tradingsApp }) => tradingsApp.contacts.users);
	const robots = useSelector(({ tradingsApp }) => tradingsApp.contacts.robots);
	const plans = useSelector(({ tradingsApp }) => tradingsApp.contacts.plans);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (contactDialog.type === 'edit' && contactDialog.data) {
			setForm({ ...contactDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (contactDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...contactDialog.data,
				id: FuseUtils.generateGUID()
			});
		}
	}, [contactDialog.data, contactDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (contactDialog.props.open) {
			initDialog();
		}
	}, [contactDialog.props.open, initDialog]);

	function closeComposeDialog(e) {
		if(e != undefined || e != null) {
			e.preventDefault();
		}
		return contactDialog.type === 'edit' ? dispatch(closeEditContactDialog()) : dispatch(closeNewContactDialog());
	}

	function canBeSubmitted() {
		return form.manager_id != -1 && form.plan_id != -1 && form.robot_id != -1;
	}

	function handleSubmit(event) {
		event.preventDefault();

		let d = new Date();
		let time = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ':' +
					d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();

		if (contactDialog.type === 'new') {
			dispatch(addContact({...form, created_time: time}));
		} else {
			dispatch(updateContact({...form, created_time: time}));
		}
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...contactDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{contactDialog.type === 'new' ? 'New Trading License' : 'Edit Trading License'}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex mb-20">
						<div className="min-w-48 pt-20">
							<Icon color="action">account_circle</Icon>
						</div>
						<FormControl variant="outlined" className="w-full">
							<InputLabel id="manager-label">Manager</InputLabel>
							<Select
								labelId="manager-label"
								id="manager_id"
								name="manager_id"
								value={form.manager_id}
								onChange={handleChange}
								label="Manager"
								fullWidth
								error={form.manager_id === -1}
							>
								{
									users.map(ele => {
										return (
											<MenuItem key={ele.id} value={ele.id}>{ele.first_name}</MenuItem>
										)
									})
								}
							</Select>
						</FormControl>
					</div>

					<div className="flex mb-20">
						<div className="min-w-48 pt-20">
							<FaRobot size={30}/>
						</div>
						<FormControl variant="outlined" className="w-full">
							<InputLabel id="robot-label">Robot</InputLabel>
							<Select
								labelId="robot-label"
								id="robot_id"
								name="robot_id"
								value={form.robot_id}
								onChange={handleChange}
								label="Robot"
								fullWidth
								error={form.robot_id === -1}
							>
								{
									robots.map(ele => {
										return (
											<MenuItem key={ele.id} value={ele.id}>{ele.id}</MenuItem>
										)
									})
								}
							</Select>
						</FormControl>
					</div>

					<div className="flex mb-20">
						<div className="min-w-48 pt-20">
							<GrPlan size={30}/>
						</div>
						<FormControl variant="outlined" className="w-full">
							<InputLabel id="plan-label">Plan</InputLabel>
							<Select
								labelId="plan-label"
								id="plan_id"
								name="plan_id"
								value={form.plan_id}
								onChange={handleChange}
								label="Plan"
								fullWidth
								error={form.plan_id === -1}
							>
								{
									plans.map(ele => {
										return (
											<MenuItem key={ele.id} value={ele.id}>{ele.id}</MenuItem>
										)
									})
								}
							</Select>
						</FormControl>
					</div>

					<div className="flex mb-20">
						<div className="min-w-48 pt-20">
							<AiOutlineFieldNumber size={30}/>
						</div>
						<TextField
							className="mb-24"
							label="AccountNumber"
							id="account_number"
							name="account_number"
							value={form.account_number}
							onChange={handleChange}
							variant="outlined"
							fullWidth
						/>
					</div>
					

				</DialogContent>

				{contactDialog.type === 'new' ? (
					<DialogActions className="justify-between p-8 ">
						<div className="flex flex-1 items-center justify-center">
							<div className="px-16">
								<Button
									variant="contained"
									color="primary"
									onClick={handleSubmit}
									type="submit"
									disabled={!canBeSubmitted()}
								>
									Add
								</Button>
							</div>
							<div className="px-16">
								<Button
									variant="contained"
									color="secondary"
									type="submit"
									onClick={closeComposeDialog}
								>
									Cancel
								</Button>
							</div>
						</div>
					</DialogActions>
				) : (
					<DialogActions className="justify-between p-8">
						<div className="flex flex-1 items-center justify-center">
							<div className="px-16">
								<Button
									variant="contained"
									color="primary"
									type="submit"
									onClick={handleSubmit}
									disabled={!canBeSubmitted()}
								>
									Save
								</Button>
							</div>
							<div className="px-16">
								<Button
									variant="contained"
									color="secondary"
									type="submit"
									onClick={closeComposeDialog}
								>
									Cancel
								</Button>
							</div>
						</div>
					</DialogActions>
				)}
			</form>
		</Dialog>
	);
}

export default TradingDialog;
