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

import {MdDescription } from 'react-icons/md'
import {AiFillInteraction} from 'react-icons/ai';

const defaultFormState = {
	active: -1,
	manager_id: -1,
	description: '',
	no: '',
};

function RobotDialog(props) {
	const dispatch = useDispatch();
	const contactDialog = useSelector(({ robotsApp }) => robotsApp.contacts.contactDialog);
	const users = useSelector(({robotsApp}) => robotsApp.contacts.users);

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
		return form.active != -1 && form.manager_id != -1;
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (contactDialog.type === 'new') {
			dispatch(addContact(form));
		} else {
			dispatch(updateContact(form));
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
						{contactDialog.type === 'new' ? 'New User' : 'Edit User'}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex mb-20">
						<div className="min-w-48 pt-20">
							<AiFillInteraction size={30}/>
						</div>
						<FormControl variant="outlined" className="w-full">
							<InputLabel id="active-label">Status</InputLabel>
							<Select
								labelId="active-label"
								id="active"
								name="active"
								value={form.active}
								onChange={handleChange}
								label="Status"
								fullWidth
								error={form.active === -1}
							>
								<MenuItem value='active'>active</MenuItem>
								<MenuItem value='inactive'>inactive</MenuItem>
							</Select>
						</FormControl>
					</div>

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
							<MdDescription size={30}/>
						</div>
						<TextField
							className="mb-24"
							label="Description"
							id="description"
							name="description"
							value={form.description}
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

export default RobotDialog;
