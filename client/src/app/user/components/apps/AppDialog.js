import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import Icon from '@material-ui/core/Icon';
// import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import {FaAudioDescription} from 'react-icons/fa';
// import {BiTimeFive} from 'react-icons/bi';
// import {WiTime8} from 'react-icons/wi';
import {MdReport} from 'react-icons/md';
import {VscCallOutgoing } from 'react-icons/vsc';

import {
	updateContact,
	addContact,
	closeNewContactDialog,
	closeEditContactDialog
} from './store/actions';

const defaultFormState = {
	appname: '',
	end_time: '0000-00-00:00-00-00',
	app_unique_ping: '',
	reported: -1,
};

function AppDialog(props) {
	const dispatch = useDispatch();
	const contactDialog = useSelector(({ appsApp }) => appsApp.contacts.contactDialog);

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
		return form.appname != '' && form.reported != -1;
	}

	function handleSubmit(event) {
		event.preventDefault();

		let d = new Date();
		let time = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ':' +
					d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();

		if (contactDialog.type === 'new') {
			dispatch(addContact({...form, start_time: time, last_ping: time}));
		} else {
			dispatch(updateContact({...form, start_time: time, last_ping: time}));
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
						{contactDialog.type === 'new' ? 'New App' : 'Edit App'}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<div className="min-w-48 pt-20">
							<FaAudioDescription size={30}/>
						</div>

						<TextField
							className="mb-24"
							label="AppName"
							autoFocus
							id="appname"
							name="appname"
							value={form.appname}
							onChange={handleChange}
							variant="outlined"
							fullWidth
							error={form.appname === ''}
						/>
					</div>
					<div className="flex">
						<div className="min-w-48 pt-20">
							<VscCallOutgoing size={30}/>
						</div>

						<TextField
							className="mb-24"
							label="AppUniquePing"
							id="app_unique_ping"
							name="app_unique_ping"
							value={form.app_unique_ping}
							onChange={handleChange}
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-20">
						<div className="min-w-48 pt-20">
							<MdReport size={30}/>
						</div>
						<FormControl variant="outlined" className="w-full">
							<InputLabel id="user-label">Reported</InputLabel>
							<Select
								labelId="user-label"
								id="reported"
								name="reported"
								value={form.reported}
								onChange={handleChange}
								label="Reported"
								fullWidth
								error={form.reported === -1}
							>
								<MenuItem value={1}>Yes</MenuItem>
								<MenuItem value={0}>No</MenuItem>
							</Select>
						</FormControl>
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

export default AppDialog;
