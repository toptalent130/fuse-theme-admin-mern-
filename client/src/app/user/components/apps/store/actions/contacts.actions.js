//import { getUserData } from 'app/main/apps/contacts/store/actions/user.actions';
import axios from 'axios';
import { SERVER_URL } from 'app/ApiConfig';

export const GET_CONTACTS = '[APPS APP] GET CONTACTS';
export const SET_SEARCH_TEXT = '[APPS APP] SET SEARCH TEXT';
export const OPEN_NEW_CONTACT_DIALOG = '[APPS APP] OPEN NEW CONTACT DIALOG';
export const CLOSE_NEW_CONTACT_DIALOG = '[APPS APP] CLOSE NEW CONTACT DIALOG';
export const OPEN_EDIT_CONTACT_DIALOG = '[APPS APP] OPEN EDIT CONTACT DIALOG';
export const CLOSE_EDIT_CONTACT_DIALOG = '[APPS APP] CLOSE EDIT CONTACT DIALOG';
export const ADD_CONTACT = '[APPS APP] ADD CONTACT';
export const UPDATE_CONTACT = '[APPS APP] UPDATE CONTACT';
export const REMOVE_CONTACT = '[APPS APP] REMOVE CONTACT';
export const REMOVE_CONTACTS = '[APPS APP] REMOVE CONTACTS';

export const getContacts = () => dispatch =>  {
	axios
    .post(`${SERVER_URL}/api/apps/get_apps`)
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
    .post(`${SERVER_URL}/api/apps/add_app`, newContact)
    .then(res => {
		dispatch({
			type: ADD_CONTACT,
			payload: {...newContact, 
				id: res.data.id, 
				start_time: res.data.start_time, 
				end_time: res.data.end_time,
				last_ping: res.data.last_ping,
			},
		});
    })
    .catch(err =>{
		console.log(err);
	});
}

export const updateContact = (contact) => dispatch => {
	axios
    .post(`${SERVER_URL}/api/apps/update_app`, contact)
    .then(res => {
		dispatch({
			type: UPDATE_CONTACT,
			payload: {...contact, 
				start_time: res.data.start_time,
				last_ping: res.data.last_ping,
				end_time: res.data.end_time,
			},
		});
    })
    .catch(err =>{
      console.log('error: ', err);
	});
}

export const removeContact = (contactId) => dispatch => {
	axios
    .post(`${SERVER_URL}/api/apps/delete_app`, contactId)
    .then(res => {
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
