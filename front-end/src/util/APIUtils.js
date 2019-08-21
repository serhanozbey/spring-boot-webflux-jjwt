import {ACCESS_TOKEN, API_BASE_URL} from '../constants';

//TODO: Instead of functions here being stateless, we can create this instance at App.js, pass the unauthenticate option and use it if there is a 401 caught.

const request = (options) => {
	const headers = new Headers({
		'Content-Type': 'application/json',
	});

	if (localStorage.getItem(ACCESS_TOKEN)) {
		headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
	}

	const defaults = {headers: headers};
	options = Object.assign({}, defaults, options);

	return fetch(options.url, options)
		.then(response =>
			response.json().then(json => {
				if (!response.ok) {
					return Promise.reject(json);
				}
				return json;
			})
		).catch(error => {
			//FIXME: Duplicated notifications problem. Interceptors should be implemented instead of these.
			if (error.status === 401) {
				localStorage.removeItem(ACCESS_TOKEN);
				// toast((error.message) + '. Please login to continue.');
				//TODO: A redirect should happen here.
			} else if (error.status === 500) {
				// toast('Service is currently unavailable.')
			}
			throw(error);
		})
};

export function getCurrentUser() {
	if (!localStorage.getItem(ACCESS_TOKEN)) {
		return Promise.reject("No access token set.");
	}

	return request({
		url: API_BASE_URL + "/user/me",
		method: 'GET'
	});
}

export function getFeed() {
	if (!localStorage.getItem(ACCESS_TOKEN)) {
		return Promise.reject("No access token set.");
	}

	return request({
		url: API_BASE_URL + "/api/feed/feed",
		method: 'GET'
	});
}

export function postFeed(postRequest, userId) {
	if (!localStorage.getItem(ACCESS_TOKEN)) {
		return Promise.reject("No access token set.");
	}

	return request({
		url: API_BASE_URL + "/api/feed/user/" + userId +"/feed",
		method: 'POST',
		body: JSON.stringify(postRequest)
	});
}

export function deleteFeed(feedPostId) {
	if (!localStorage.getItem(ACCESS_TOKEN)) {
		return Promise.reject("No access token set.");
	}

	return request({
		url: API_BASE_URL + "/api/feed/" + feedPostId,
		method: 'DELETE',
		body: JSON.stringify(feedPostId)
	});
}

export function getTodos() {
	if (!localStorage.getItem(ACCESS_TOKEN)) {
		return Promise.reject("No access token set.");
	}

	return request({
		url: API_BASE_URL + "/api/todo/todo",
		method: 'GET'
	});
}

export function postTodo(todoRequest) {
	if (!localStorage.getItem(ACCESS_TOKEN)) {
		return Promise.reject("No access token set.");
	}

	return request({
		url: API_BASE_URL + "/api/todo/todo",
		method: 'POST',
		body: JSON.stringify(todoRequest)
	});
}

export function updateTodo(updatedTodo) {
	if (!localStorage.getItem(ACCESS_TOKEN)) {
		return Promise.reject("No access token set.");
	}

	return request({
		url: API_BASE_URL + "/api/todo/todo",
		method: 'PUT',
		body: JSON.stringify(updatedTodo)
	});
}

export function deleteTodo(todoId) {
	if (!localStorage.getItem(ACCESS_TOKEN)) {
		return Promise.reject("No access token set.");
	}

	return request({
		url: API_BASE_URL + "/api/todo/todo/" + todoId,
		method: 'DELETE',
		body: JSON.stringify(todoId)
	});
}

export function login(loginRequest) {
	return request({
		url: API_BASE_URL + "/login",
		method: 'POST',
		body: JSON.stringify(loginRequest)
	});
}

export function signup(signupRequest) {
	return request({
		url: API_BASE_URL + "/signup",
		method: 'POST',
		body: JSON.stringify(signupRequest)
	});
}
