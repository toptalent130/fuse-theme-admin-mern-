//import { getUserData } from 'app/main/apps/contacts/store/actions/user.actions';
import axios from 'axios';
import { SERVER_URL } from 'app/ApiConfig';

export const GET_CONTACTS = '[SERVERS APP] GET ROBOTS';
export const SET_SEARCH_TEXT = '[SERVERS APP] SET SEARCH TEXT';
export const OPEN_NEW_CONTACT_DIALOG = '[SERVERS APP] OPEN NEW ROBOTS DIALOG';
export const CLOSE_NEW_CONTACT_DIALOG = '[SERVERS APP] CLOSE NEW ROBOTS DIALOG';
export const OPEN_EDIT_CONTACT_DIALOG = '[SERVERS APP] OPEN EDIT ROBOTS DIALOG';
export const CLOSE_EDIT_CONTACT_DIALOG = '[SERVERS APP] CLOSE EDIT ROBOTS DIALOG';
export const ADD_CONTACT = '[SERVERS APP] ADD ROBOTS';
export const UPDATE_CONTACT = '[SERVERS APP] UPDATE ROBOTS';
export const REMOVE_CONTACT = '[SERVERS APP] REMOVE ROBOT';
export const REMOVE_CONTACTS = '[SERVERS APP] REMOVE ROBOTS';

export const getContacts = (data) => dispatch =>  {
	axios
    .post(`${SERVER_URL}/api/servers/get_servers`, data)
    .then(res => {
		dispatch({
			type: GET_CONTACTS,
			payload: res.data,
		});
    })
    .catch(err =>{
      console.log('error: ', err);
	});
}

export function setSearchText(event) {
	return {
		type: SET_SEARCH_TEXT,
		searchText: event.target.value
	};
}

export function openNewContactDialog() {
	return {
		type: OPEN_NEW_CONTACT_DIALOG
	};
}

export function closeNewContactDialog() {
	return {
		type: CLOSE_NEW_CONTACT_DIALOG
	};
}

export function openEditContactDialog(data) {
	return {
		type: OPEN_EDIT_CONTACT_DIALOG,
		data
	};
}

export function closeEditContactDialog() {
	return {
		type: CLOSE_EDIT_CONTACT_DIALOG
	};
}

export const addContact = (newContact) => dispatch => {
	axios
    .post(`${SERVER_URL}/api/servers/add_server`, newContact)
    .then(res => {
		dispatch({
			type: ADD_CONTACT,
			payload: {...newContact, id: res.data.id, start_time: res.data.start_time, end_time: res.data.end_time},
		});
    })
    .catch(err =>{
      console.log('error: ', err);
	});
}

export const updateContact = (contact) => dispatch => {
	axios
    .post(`${SERVER_URL}/api/servers/update_server`, contact)
    .then(res => {
		dispatch({
			type: UPDATE_CONTACT,
			payload: {...contact, start_time: res.data.start_time, end_time: res.data.end_time},
		});
    })
    .catch(err =>{
      console.log('error: ', err);
	});
}

export const removeContact = (contactId) => dispatch => {
	axios
    .post(`${SERVER_URL}/api/servers/delete_server`, contactId)
    .then(res => {
		console.log('response: ', res.data);
		dispatch({
			type: REMOVE_CONTACT,
			payload: contactId,
		});
    })
    .catch(err =>{
      console.log('error: ', err);
	});
}

// export function removeContacts(contactIds) {
// 	return (dispatch, getState) => {
// 		const { routeParams } = getState().contactsApp.contacts;

// 		const request = axios.post('/api/contacts-app/remove-contacts', {
// 			contactIds
// 		});

// 		return request.then(response =>
// 			Promise.all([
// 				dispatch({
// 					type: REMOVE_CONTACTS
// 				})
// 			]).then(() => dispatch(getContacts(routeParams)))
// 		);
// 	};
// }
