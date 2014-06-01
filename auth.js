var crypto = require('crypto'),
	aes = require('crypto-js/aes'),
	fs = require('fs');

var users = {};

function loadDB() {
	fs.readFile('./userdb.json', {encoding: 'utf-8'}, function (err, data) {
		if (err) throw err;
		if (data) users = JSON.parse(data);
	});
};

function saveDB() {
	var data = {}
	for (var id in users) {
		var user = users[id];
		data[user.id] = {
			id: user.id,
			pw: user.pw,
			salt: user.salt
		}
	}
	fs.writeFile('./userdb.json', JSON.stringify(data), function (err) {
		if (err) throw err;
	});
}

function add(id, pw, salt) {
	users[id] = {id: id, pw: pw, salt: salt, token: ''};
	saveDB();
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
			user.challenge = '';
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

loadDB();
