var crypto = require('crypto'),
	aes = require('crypto-js/aes'),
	fs = require('fs');

module.exports = InMemoryStore;

function InMemoryStore(config) {
	var self = this;
	
	self.file = config.file;

	self.users = {};

	self.loadDB();

}

InMemoryStore.prototype.loadDB = function () {
	var self = this;

	fs.readFile(self.file, {encoding: 'utf-8'}, function (err, data) {

		if (err)	return cb(err);

		self.users = data ? JSON.parse(data) : {};

	});

};

InMemoryStore.prototype.saveDB = function (cb) {
	var self = this;
	var data = {};

	for (var id in self.users) {
		var user = self.users[id];

		data[user.id] = {
			id: user.id,
			key: user.key,
			salt: user.salt
		};

	}

	fs.writeFile('./userdb.json', JSON.stringify(data), function (err) {

		if (err)	return cb(err);

		return cb(null);
	});

};

InMemoryStore.prototype.find = function (id, cb) {
	var self = this;

	return cb(null, self.users[id]);
};

InMemoryStore.prototype.add = function (id, pw, cb) {
	var self = this;
	var key = self.genKey(pw);

	self.users[id] = {id: id, key: key.key, salt: key.salt, token: ''};

	self.saveDB(function (err) {

		if (err)	return cb(err);

		return cb(null, self.users[id]);
	});

};

InMemoryStore.prototype.genKey = function (pw) {
	var self = this;
	var salt = (Math.random().toString().slice(2) + '00000000000000000000000000000000').slice(0, 32),
		key = crypto.createHash('sha1').update(pw + salt).digest('hex');

	return {key: key, salt: salt};
};

InMemoryStore.prototype.modify = function (user, newId, newPw, cb) {
	var self = this;

	if (newId !== user.id) {

		delete self.users[user.id];

		user.id = newId;

		self.users[newId] = user;

	}

	var key = self.genKey(newPw);
	user.key = key.key;
	user.salt = key.salt;

	self.saveDB(cb);

};

InMemoryStore.prototype.remove = function (user, cb) {
	var self = this;

	delete self.users[user.id];

	self.saveDB(cb);

};

InMemoryStore.prototype.list = function (cb) {
	var self = this;
	var list = [];

	for (var id in self.users) {

		list.push(self.users[id]);

	}

	return cb(null, list);
};

InMemoryStore.prototype.findAndCheck = function (id, secret, cb) {
	var self = this;

	self.find(id, function (err, user) {

		if (err)	return cb(err);

		if (user && user.secret === secret) {

			user.challenge = '';

			return cb(null, user);
		} else {

			return cb(null, null);
		}	
	});

};

InMemoryStore.prototype.getChallenge = function (user, cb) {
	var self = this;

	if (!user.challenge) {
		var challenge = self.genChallenge(user.key);

		user.secret = challenge.secret;
		user.challenge = challenge.challenge;

	}

	return cb(null, user.salt, user.challenge);
}

InMemoryStore.prototype.genChallenge = function (key) {
	var secret = Math.random().toString().slice(2),
		challenge = aes.encrypt(secret, key).toString();

	return {
		secret: secret,
		challenge: challenge
	};
};

InMemoryStore.prototype.genToken = function () {

	return Math.random().toString().slice(2);
};

InMemoryStore.prototype.clearToken = function (user, cb) {

	user.token = '';

	return cb(null, user);
};

InMemoryStore.prototype.findCheckGenToken = function (id, secret, cb) {
	var self = this;
	
	self.findAndCheck(id, secret, function (err, user) {

		if (err)	return cb(err);

		if (user) {

			user.token = self.genToken();

			return cb(null, user);
		} else {

			return cb(null, null);
		}
	});

};
