var crypto = require('crypto'),
	aes = require('crypto-js/aes'),
	fs = require('fs'),
	users = {};

module.exports = {

	create: function (id, pw) {

		if (find(id))
			return resHelper(false, {msg: 'ID exists.'});
		else
			return add(id, pw) ? resHelper(true, {id: id}) : resHelper(false);
	},

	update: function (id, secret, newId, newPw) {
		var user = findCheckGenToken(id, secret);

		if (user) {
			modify(user, newId, newPw);
			return resHelper(true, {id: user.id, token: user.token});
		} else {
			return resHelper(false, {msg: 'User not exist or incorrect password.'});
		}
	},

	delete: function (id, secret) {
		var user = findAndCheck(id, secret);

		if (user) {
			remove(user);
			return resHelper(true);
		} else {
			return resHelper(false, {msg: 'User not exist or incorrect password.'});
		}
	},

	list: function () {
		return list();
	},

	loginchallenge: function (id) {
		var user = find(id);

		if (!user) {
			return resHelper(false, {msg: 'ID not exists.'});
		}

		if (!user.challenge) {
			user.secret = Math.random().toString().slice(2);
			user.challenge = aes.encrypt(user.secret, user.key).toString();
		}

		return resHelper(true, {challenge: user.challenge, salt: user.salt});
	},

	login: function (id, secret) {
		var user = findCheckGenToken(id, secret);

		if (user) {
			return resHelper(true, {id: user.id, token: user.token});
		} else {
			return resHelper(false, {msg: 'Login failed.'});
		}
	},

	logout: function (id, token) {
		var user = find(id);

		if (user && user.token && user.token === token) {
			user.token = '';
			return resHelper(true);
		} else {
			return resHelper(false, {msg: 'Logout failed.'});
		}
	}
}

function loadDB() {

	fs.readFile('./userdb.json', {encoding: 'utf-8'}, function (err, data) {
		if (err) throw err;
		if (data) users = JSON.parse(data);
	});
}

function saveDB() {
	var data = {};

	for (var id in users) {
		var user = users[id];
		data[user.id] = {
			id: user.id,
			key: user.key,
			salt: user.salt
		}
	}

	fs.writeFile('./userdb.json', JSON.stringify(data), function (err) {
		if (err) throw err;
	});
}

function find(id) {
	return users[id];
}

function add(id, pw) {
	var key = genKey(pw);

	users[id] = {id: id, key: key.key, salt: key.salt, token: ''};

	saveDB();

	return true;
};

function genKey(pw) {
	var salt = (Math.random().toString().slice(2) + '00000000000000000000000000000000').slice(0, 32),
		key = crypto.createHash('sha1').update(pw + salt).digest('hex');

	return {key: key, salt: salt};
}

function modify(user, newId, newPw) {

	if (newId !== user.id) {
		delete users[user.id];
		user.id = newId;
		users[newId] = user
	}

	var key = genKey(newPw);
	user.key = key.key;
	user.salt = key.salt;

	saveDB();
};

function remove(user) {

	delete users[user.id];
	saveDB();
}

function list() {
	var list = [];

	for (id in users) {
		list.push(users[id]);
	}

	return list;
};

function findAndCheck(id, secret) {
	var user = find(id);

	if (user && user.secret === secret) {
		user.challenge = '';
		return user;
	} else {
		return false;
	}
}

function genToken() {
	return Math.random().toString().slice(2);
}

function findCheckGenToken(id, secret) {
	var user = findAndCheck(id, secret);

	user.token = genToken();
	return user;
}

function resHelper(result, payload) {
	return {result: result, payload: payload};
}

loadDB();
