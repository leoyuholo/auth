var users = {};

function add(id, pw) {
	users[id] = {id: id, pw: pw, token: ''};
	return {result: true, id: id};
};

function list() {
	var list = [];
	for (id in users) {
		list.push(users[id]);
	}
	return list;
};

function find(id) {
	return users[id];
};

module.exports = {

	create: function(id, pw) {
		if (find(id)) {
			return {result: false, msg: 'ID exists.'};
		} else {
			return add(id, pw);
		}
	},

	list: function() {
		return list();
	},

	login: function(id, pw) {
		var user = find(id);
		if (user && user.pw === pw) {
			var token = Math.random().toString().slice(2);
			user.token = token;
			return {result: true, token:token};
		}
		return {result: false, msg: 'Login failed.'};
	},

	logout: function(id, token) {
		var user = find(id);
		if (user && user.token === token) {
			user.token = '';
			return {result: true};
		}
		return {result: false, msg: 'Logout failed.'};
	}
}