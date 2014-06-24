// Abstract class of user data store

var crypto = require('crypto'),
	aes = require('crypto-js/aes');

module.exports = UserStore;

function UserStore(config) {

}

UserStore.prototype.destroy = function() {
	
};

UserStore.prototype.setUser = function (user, cb) {

};

UserStore.prototype.getUser = function (id, cb) {

};

UserStore.prototype.delUser = function (id, cb) {

};

UserStore.prototype.find = function (id, cb) {
	var self = this;

	self.getUser(id, function (err, user) {

		cb(err, user);

	});

};

UserStore.prototype.add = function (id, pw, cb) {
	var self = this;
	var key = self.genKey(pw),
		user = {id: id, key: key.key, salt: key.salt, token: ''};

	self.setUser(user, function (err, reply) {

		if (err)	return cb(err);

		return cb(null, user);
	});

};

UserStore.prototype.modify = function (user, newId, newPw, cb) {
	var self = this;

	var key = self.genKey(newPw);
	user.key = key.key;
	user.salt = key.salt;
	user.secret = '';
	user.challenge = '';

	if (newId !== user.id) {

		self.delUser(user.id, function (err, reply) {

			if (err)	return cb(err);

			user.id = newId;

			self.setUser(user, cb);

		});

	} else {

		self.setUser(user, cb);

	}

};

UserStore.prototype.remove = function (user, cb) {
	var self = this;

	self.delUser(user.id, cb);

};

UserStore.prototype.findAndCheck = function (id, secret, cb) {
	var self = this;

	self.find(id, function (err, user) {

		if (err)	return cb(err);

		if (user && user.secret === secret) {

			user.secret = '';
			user.challenge = '';

			self.setUser(user, function (err, reply) {

				if (err)	return cb(err);

				return cb(null, user);
			});

		} else {

			return cb(null, null);
		}

	});

};

UserStore.prototype.getChallenge = function (user, cb) {
	var self = this;

	if (!user.challenge) {
		var challenge = self.genChallenge(user.key);

		user.secret = challenge.secret;
		user.challenge = challenge.challenge;

		self.setUser(user, function (err, reply) {

			return cb(null, user.salt, user.challenge);
		});

	} else {

		return cb(null, user.salt, user.challenge);
	}

};

UserStore.prototype.findCheckGenToken = function (id, secret, cb) {
	var self = this;

	self.findAndCheck(id, secret, function (err, user) {

		if (err)	return cb(err);

		if (user) {

			user.token = self.genToken();

			self.setUser(user, function (err, reply) {

				return cb(null, user);
			});

		} else {

			return cb(null, null);
		}

	});

};

UserStore.prototype.clearToken = function (user, cb) {
	var self = this;

	user.token = '';

	self.setUser(user, function (err, reply) {

		if (err)	return cb(err);

		return cb(null, user);
	});

};

UserStore.prototype.genKey = function (pw) {
	var salt = (Math.random().toString().slice(2) + '00000000000000000000000000000000').slice(0, 32),
		key = crypto.createHash('sha1').update(pw + salt).digest('base64');

	return {key: key, salt: salt};
};

UserStore.prototype.genChallenge = function (key) {
	var secret = Math.random().toString().slice(2),
		challenge = aes.encrypt(secret, key).toString();

	return {
		secret: secret,
		challenge: challenge
	};
};

UserStore.prototype.genToken = function () {

	return Math.random().toString().slice(2);
};
