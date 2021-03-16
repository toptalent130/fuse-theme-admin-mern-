//import { getUserData } from 'app/main/apps/contacts/store/actions/user.actions';
import axios from 'axios';
import { SERVER_URL} from  'app/ApiConfig';
export const GET_CONTACTS = '[PLANS APP] GET CONTACTS';
export const SET_SEARCH_TEXT = '[PLANS APP] SET SEARCH TEXT';
export const OPEN_NEW_CONTACT_DIALOG = '[PLANS APP] OPEN NEW CONTACT DIALOG';
export const CLOSE_NEW_CONTACT_DIALOG = '[PLANS APP] CLOSE NEW CONTACT DIALOG';
export const OPEN_EDIT_CONTACT_DIALOG = '[PLANS APP] OPEN EDIT CONTACT DIALOG';
export const CLOSE_EDIT_CONTACT_DIALOG = '[PLANS APP] CLOSE EDIT CONTACT DIALOG';
export const ADD_CONTACT = '[PLANS APP] ADD CONTACT';
export const UPDATE_CONTACT = '[PLANS APP] UPDATE CONTACT';
export const REMOVE_CONTACT = '[PLANS APP] REMOVE CONTACT';
export const REMOVE_CONTACTS = '[PLANS APP] REMOVE CONTACTS';

export const getContacts = (data) => dispatch =>  {
	axios
    .post(`${SERVER_URL}/api/plans/get_plans`, data)
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
    .post(`${SERVER_URL}/api/plans/add_plan`, newContact)
    .then(res => {
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
	console.log('contact: ', contact);
	axios
    .post(`${SERVER_URL}/api/plans/update_plan`, contact)
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
    .post(`${SERVER_URL}/api/plans/delete_plan`, contactId)
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
