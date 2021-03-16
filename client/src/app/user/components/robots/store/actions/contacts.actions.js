//import { getUserData } from 'app/main/apps/contacts/store/actions/user.actions';
import axios from 'axios';
import { SERVER_URL } from 'app/ApiConfig';
export const GET_CONTACTS = '[ROBOTS APP] GET ROBOTS';
export const SET_SEARCH_TEXT = '[ROBOTS APP] SET SEARCH TEXT';
export const OPEN_NEW_CONTACT_DIALOG = '[ROBOTS APP] OPEN NEW ROBOTS DIALOG';
export const CLOSE_NEW_CONTACT_DIALOG = '[ROBOTS APP] CLOSE NEW ROBOTS DIALOG';
export const OPEN_EDIT_CONTACT_DIALOG = '[ROBOTS APP] OPEN EDIT ROBOTS DIALOG';
export const CLOSE_EDIT_CONTACT_DIALOG = '[ROBOTS APP] CLOSE EDIT ROBOTS DIALOG';
export const ADD_CONTACT = '[ROBOTS APP] ADD ROBOTS';
export const UPDATE_CONTACT = '[ROBOTS APP] UPDATE ROBOTS';
export const REMOVE_CONTACT = '[ROBOTS APP] REMOVE ROBOT';
export const REMOVE_CONTACTS = '[ROBOTS APP] REMOVE ROBOTS';

export const getContacts = (data) => dispatch =>  {
	axios
    .post(`${SERVER_URL}/api/robots/get_robots`, data)
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
    .post(`${SERVER_URL}/api/robots/add_robot`, newContact)
    .then(res => {
		console.log('result: ', res);
		dispatch({
			type: ADD_CONTACT,
			payload: {...newContact, id: res.data.id},
		});
    })
    .catch(err =>{
      console.log('error: ', err);
	});
}

export const updateContact = (contact) => dispatch => {
	axios
    .post(`${SERVER_URL}/api/robots/update_robot`, contact)
    .then(res => {
		dispatch({
			type: UPDATE_CONTACT,
			payload: contact,
		});
    })
    .catch(err =>{
      console.log('error: ', err);
	});
}

export const removeContact = (contactId) => dispatch => {
	axios
    .post(`${SERVER_URL}/api/robots/delete_robot`, contactId)
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
