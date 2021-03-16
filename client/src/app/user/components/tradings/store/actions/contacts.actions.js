//import { getUserData } from 'app/main/apps/contacts/store/actions/user.actions';
import axios from 'axios';
import { SERVER_URL} from 'app/ApiConfig';
export const GET_CONTACTS = '[TRADINGS APP] GET CONTACTS';
export const SET_SEARCH_TEXT = '[TRADINGS APP] SET SEARCH TEXT';
export const OPEN_NEW_CONTACT_DIALOG = '[TRADINGS APP] OPEN NEW CONTACT DIALOG';
export const CLOSE_NEW_CONTACT_DIALOG = '[TRADINGS APP] CLOSE NEW CONTACT DIALOG';
export const OPEN_EDIT_CONTACT_DIALOG = '[TRADINGS APP] OPEN EDIT CONTACT DIALOG';
export const CLOSE_EDIT_CONTACT_DIALOG = '[TRADINGS APP] CLOSE EDIT CONTACT DIALOG';
export const ADD_CONTACT = '[TRADINGS APP] ADD CONTACT';
export const UPDATE_CONTACT = '[TRADINGS APP] UPDATE CONTACT';
export const REMOVE_CONTACT = '[TRADINGS APP] REMOVE CONTACT';
export const REMOVE_CONTACTS = '[TRADINGS APP] REMOVE CONTACTS';

export const getContacts = (data) => dispatch =>  {
	axios
    .post(`${SERVER_URL}/api/tradings/get_tradings`, data)
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
    .post(`${SERVER_URL}/api/tradings/add_trading`, newContact)
    .then(res => {
		console.log('result: ', res);
		dispatch({
			type: ADD_CONTACT,
			payload: {
				...newContact, 
				id: res.data.id, 
				created_time: res.data.created_time, 
				canceled_time: res.data.canceled_time
			},
		});
    })
    .catch(err =>{
      console.log('error: ', err);
	});
}

export const updateContact = (contact) => dispatch => {
	console.log('updata time is :', contact);
	axios
    .post(`${SERVER_URL}/api/tradings/update_trading`, contact)
    .then(res => {
		dispatch({
			type: UPDATE_CONTACT,
			payload: {...contact, created_time: res.data.created_time, canceled_time: res.data.canceled_time},
		});
    })
    .catch(err =>{
      console.log('error: ', err);
	});
}

export const removeContact = (contactId) => dispatch => {
	axios
    .post(`${SERVER_URL}/api/tradings/delete_trading`, contactId)
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
