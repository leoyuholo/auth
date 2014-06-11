var InMemoryStore = require('./InMemoryStore.js'),
	RedisStore = require('./RedisStore.js');

module.exports = Auth;

function Auth(config) {
	var self = this;

	if (config.redis) {
		self.store = new RedisStore(config.redis);
	}

	// default
	if (!self.store) {

		self.store = new InMemoryStore({file: './userdb.json'});

	}

}

Auth.prototype.create = function (id, pw, cb) {
	var self = this;

	self.store.find(id, function (err, user) {

		if (err)	return cb(err);

		if (user)	return cb(null, resHelper(false, {msg: 'ID exists.'}));

		self.store.add(id, pw, function (err, user) {

			if (err)	return cb(err);

			return cb(null, user ? resHelper(true, {id: user.id}) : resHelper(false));
		});

	});

};

Auth.prototype.update = function (id, secret, newId, newPw, cb) {
	var self = this;

	self.store.findCheckGenToken(id, secret, function (err, user) {

		if (err)	return cb(err);

		if (user) {

			self.store.modify(user, newId, newPw, function (err) {

				if (err)	return cb(err);

				return cb(null, resHelper(true, {id: user.id, token: user.token}));

			});

		} else {

			return cb(null, resHelper(false, {msg: 'User not exist or incorrect password.'}));
		}

	});

};

Auth.prototype.delete = function (id, secret, cb) {
	var self = this;

	self.store.findAndCheck(id, secret, function (err, user) {

		if (err)	return cb(err);

		if (user) {

			self.store.remove(user, function (err) {

				return cb(null, resHelper(true));
			});

		} else {

			return cb(null, resHelper(false, {msg: 'User not exist or incorrect password.'}));
		}

	});

};

Auth.prototype.list = function (cb) {
	var self = this;

	self.store.list(function (err, list) {

		if (err)	return cb(err);

		return cb(null, list);
	});

};

Auth.prototype.loginchallenge = function (id, cb) {
	var self = this;

	self.store.find(id, function (err, user) {

		if (err)	return cb(err);

		if (!user)	return cb(null, resHelper(false, {msg: 'ID not exists.'}));

		self.store.getChallenge(user, function (err, salt, challenge) {

			return cb(null, resHelper(true, {salt: salt, challenge: challenge}));
		});

	});

};

Auth.prototype.login = function (id, secret, cb) {
	var self = this;

	self.store.findCheckGenToken(id, secret, function (err, user) {

		if (err)	return cb(err);

		return cb(null, user ? resHelper(true, {id: user.id, token: user.token}) : resHelper(false, {msg: 'Login failed.'}));
	});

};

Auth.prototype.logout = function (id, token, cb) {
	var self = this;

	self.store.find(id, function (err, user) {

		if (err)	return cb(err);

		if (user && user.token && user.token === token) {

			self.store.clearToken(user, function (err, user) {

				return cb(null, resHelper(true));
			});

		} else {

			return cb(null, resHelper(false, {msg: 'Logout failed.'}));
		}

	});

};

function resHelper(result, payload) {

	return {result: result, payload: payload};
}
