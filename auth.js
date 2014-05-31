crypto = require('crypto');
aes = require('crypto-js/aes');

var users = {};

function add(id, pw) {
	users[id] = {id: id, pw: pw, token: ''};
	return true;
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

function resHelper(result, payload) {
	return {result: result, payload: payload};
}

module.exports = {

	create: function(id, pw) {
		if (find(id)) {
			return resHelper(false, {msg: 'ID exists.'});
		} else {
			return add(id, pw) ? resHelper(true, {id: id}) : resHelper(false);
		}
	},

	list: function() {
		return list();
	},

	loginchallenge: function(id) {
		var user = find(id);
		if (!user) {
			return resHelper(false, {msg: 'ID not exists.'});
		}

		if (!(user.challenge && user.salt)) {
			user.secret = Math.random().toString().slice(2);
			user.salt = (Math.random().toString().slice(2) + '00000000000000000000000000000000').slice(0, 32);
			var aesKey = crypto.createHash('sha1').update(user.pw + user.salt).digest('hex');
			user.challenge = aes.encrypt(user.secret, aesKey).toString();
		}

		return resHelper(true, {challenge: user.challenge, salt: user.salt});
	},

	login: function(id, pw) {
		var user = find(id);
		if (user && user.secret === pw) {
			var token = Math.random().toString().slice(2);
			user.token = token;
			return resHelper(true, {token:token});
		}
		return resHelper(false, {msg: 'Login failed.'});
	},

	logout: function(id, token) {
		var user = find(id);
		if (user && user.token === token) {
			user.token = '';
			return resHelper(true);
		}
		return resHelper(false, {msg: 'Logout failed.'});
	}
}