var crypto = require('crypto'),
	aes = require('crypto-js/aes');

var users = {};

function add(id, pw, salt) {
	users[id] = {id: id, pw: pw, salt: salt, token: ''};
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
			var salt = (Math.random().toString().slice(2) + '00000000000000000000000000000000').slice(0, 32),
				pw = crypto.createHash('sha1').update(pw + salt).digest('hex');
			return add(id, pw, salt) ? resHelper(true, {id: id}) : resHelper(false);
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

		if (!user.challenge) {
			user.secret = Math.random().toString().slice(2);
			user.challenge = aes.encrypt(user.secret, user.pw).toString();
		}

		return resHelper(true, {challenge: user.challenge, salt: user.salt});
	},

	login: function(id, secret) {
		var user = find(id);
		if (user && user.secret === secret) {
			user.token = Math.random().toString().slice(2);
			return resHelper(true, {token:user.token});
		}
		return resHelper(false, {msg: 'Login failed.'});
	},

	logout: function(id, token) {
		var user = find(id);
		if (user && user.token && user.token === token) {
			user.token = '';
			return resHelper(true);
		}
		return resHelper(false, {msg: 'Logout failed.'});
	}
}