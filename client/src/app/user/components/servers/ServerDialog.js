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
import React, { useCallback, useEffect, useState } from 'react';
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

import {GrServerCluster} from 'react-icons/gr';
import {BiTimeFive} from 'react-icons/bi';
import {WiTime8} from 'react-icons/wi';
import {MdAutorenew} from 'react-icons/md';
import {FaRegCommentDots} from 'react-icons/fa';

const defaultFormState = {
	user_id: -1,
	server_ip: '',
	auto_renew: -1,
	comment: '',
	end_time: '0000-00-00:00-00-00'
};

function ServerDialog(props) {
	const dispatch = useDispatch();
	const contactDialog = useSelector(({ serversApp }) => serversApp.contacts.contactDialog);
	const users = useSelector(({serversApp}) => serversApp.contacts.users);

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
		return form.user_id != -1 && form.server_ip != '' && form.auto_renew != -1 && isValidIp;
	}

	function handleSubmit(event) {
		event.preventDefault();

		let d = new Date();
		let time = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ':' +
					d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();
		if (contactDialog.type === 'new') {
			dispatch(addContact({...form, start_time: time}));
		} else {
			dispatch(updateContact({...form, start_time: time}));
		}
		closeComposeDialog();
	}

	const [isValidIp, setIsValidIp] = useState(false);
	const checkValidIp = () => {
		return /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/.test(form.server_ip);
	}
	useEffect(() => {
		setIsValidIp(checkValidIp());
	}, [form.server_ip]);

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
							<Icon color="action">account_circle</Icon>
						</div>
						<FormControl variant="outlined" className="w-full">
							<InputLabel id="user-label">User</InputLabel>
							<Select
								labelId="user-label"
								id="user_id"
								name="user_id"
								value={form.user_id}
								onChange={handleChange}
								label="User"
								fullWidth
								error={form.user_id === -1}
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
							<GrServerCluster size={30}/>
						</div>
						<TextField
							className="mb-24"
							label="ServerIP"
							id="server_ip"
							name="server_ip"
							value={form.server_ip}
							onChange={handleChange}
							variant="outlined"
							fullWidth
							error={!isValidIp}
						/>
					</div>
					<div className="flex mb-20">
						<div className="min-w-48 pt-20">
							<MdAutorenew size={30}/>
						</div>
						<FormControl variant="outlined" className="w-full">
							<InputLabel id="user-label">AutoRenew</InputLabel>
							<Select
								labelId="user-label"
								id="auto_renew"
								name="auto_renew"
								value={form.auto_renew}
								onChange={handleChange}
								label="AutoRenew"
								fullWidth
								error={form.auto_renew === -1}
							>
								<MenuItem value={1}>Yes</MenuItem>
								<MenuItem value={0}>No</MenuItem>
							</Select>
						</FormControl>
					</div>
					<div className="flex mb-20">
						<div className="min-w-48 pt-20">
							<FaRegCommentDots size={30}/>
						</div>
						<TextField
							className="mb-24"
							label="Comment"
							id="comment"
							name="comment"
							value={form.comment}
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

export default ServerDialog;
