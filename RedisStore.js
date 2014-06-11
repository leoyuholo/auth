var UserStore = require('./UserStore.js'),
	inherits = require('util').inherits,
	redis = require('redis');

module.exports = RedisStore;

inherits(RedisStore, UserStore);

function RedisStore(config) {
	var self = this;

	self.client = redis.createClient(config.port, config.ip, config);

	self.client.on('error', function (err) {
		console.log('Redis error:', err);
	});

}

RedisStore.prototype.makeKey = function (id) {

	return 'user:' + id;
};

RedisStore.prototype.setUser = function (user, cb) {
	var self = this;

	self.client.set(self.makeKey(user.id), JSON.stringify(user), cb);

};

RedisStore.prototype.getUser = function (id, cb) {
	var self = this;

	self.client.get(self.makeKey(id), function (err, reply) {

		return cb(err, reply ? JSON.parse(reply) : null);
	});

};

RedisStore.prototype.delUser = function (id, cb) {
	var self = this;

	self.client.del(self.makeKey(id), cb);

}

RedisStore.prototype.find = function (id, cb) {
	var self = this;

	self.getUser(id, function (err, user) {

		cb(err, user);

	});

};

RedisStore.prototype.add = function (id, pw, cb) {
	var self = this;
	var key = self.genKey(pw),
		user = {id: id, key: key.key, salt: key.salt, token: ''};

	self.setUser(user, function (err, reply) {

		if (err)	return cb(err);

		return cb(null, user);
	});

};

RedisStore.prototype.modify = function (user, newId, newPw, cb) {
	var self = this;

	var key = self.genKey(newPw);
	user.key = key.key;
	user.salt = key.salt;

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

RedisStore.prototype.remove = function (user, cb) {
	var self = this;

	self.delUser(user.id, cb);

};

RedisStore.prototype.list = function (cb) {
	// deprecated
};

RedisStore.prototype.findAndCheck = function (id, secret, cb) {
	var self = this;

	self.find(id, function (err, user) {

		if (err)	return cb(err);

		if (user && user.secret === secret) {

			user.getChallenge = '';

			self.setUser(user, function (err, reply) {

				if (err)	return cb(err);

				return cb(null, user);
			});

		} else {

			return cb(null, null);
		}

	});

};

RedisStore.prototype.getChallenge = function (user, cb) {
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

RedisStore.prototype.findCheckGenToken = function (id, secret, cb) {
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

RedisStore.prototype.clearToken = function (user, cb) {
	var self = this;

	user.token = '';

	self.setUser(user, function (err, reply) {

		if (err)	return cb(err);

		return cb(null, user);
	});

};
