var crypto = require('crypto'),
	aes = require('crypto-js/aes'),
	fs = require('fs'),
	redisClient = {};

module.exports = Auth;

function Auth(config) {
	var self = this;

	// default
	if (!self.store) {
		self.store = new inMemoryStore({file: './userdb.json'});
	}
};

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
			})
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
	})
};

Auth.prototype.loginchallenge = function (id, cb) {
	var self = this;

	self.store.find(id, function (err, user) {

		if (err)	return cb(err);

		if (!user)	return cb(null, resHelper(false, {msg: 'ID not exists.'}));

		if (!user.challenge) {
			// TODO: move to store
			user.secret = Math.random().toString().slice(2);
			user.challenge = aes.encrypt(user.secret, user.key).toString();
		}

		return cb(null, resHelper(true, {challenge: user.challenge, salt: user.salt}));
	})
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
			// TODO: move to store
			user.token = '';
			return cb(null, resHelper(true));
		} else {
			return cb(null, resHelper(false, {msg: 'Logout failed.'}));
		}
	})
}

function resHelper(result, payload) {
	
	return {result: result, payload: payload};
}

function inMemoryStore(config) {
	var self = this;
	
	self.file = config.file;

	self.users = {};

	self.loadDB();

}

inMemoryStore.prototype.loadDB = function () {
	var self = this;

	fs.readFile(self.file, {encoding: 'utf-8'}, function (err, data) {

		if (err)	return cb(err);

		self.users = data ? JSON.parse(data) : {};

	});
}

inMemoryStore.prototype.saveDB = function (cb) {
	var self = this;
	var data = {};

	for (var id in self.users) {
		var user = self.users[id];
		data[user.id] = {
			id: user.id,
			key: user.key,
			salt: user.salt
		}
	}

	fs.writeFile('./userdb.json', JSON.stringify(data), function (err) {

		if (err)	return cb(err);

		return cb(null);
	});
}

inMemoryStore.prototype.find = function (id, cb) {
	var self = this;

	return cb(null, self.users[id]);
}

inMemoryStore.prototype.add = function (id, pw, cb) {
	var self = this;
	var key = self.genKey(pw);

	self.users[id] = {id: id, key: key.key, salt: key.salt, token: ''};

	self.saveDB(function (err) {

		if (err)	return cb(err);

		return cb(null, self.users[id]);
	});
};

inMemoryStore.prototype.genKey = function (pw) {
	var self = this;
	var salt = (Math.random().toString().slice(2) + '00000000000000000000000000000000').slice(0, 32),
		key = crypto.createHash('sha1').update(pw + salt).digest('hex');

	return {key: key, salt: salt};
}

inMemoryStore.prototype.modify = function (user, newId, newPw, cb) {
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

inMemoryStore.prototype.remove = function (user, cb) {
	var self = this;

	delete self.users[user.id];

	self.saveDB(cb);
}

inMemoryStore.prototype.list = function (cb) {
	var self = this;
	var list = [];

	for (id in self.users) {

		list.push(self.users[id]);

	}

	return cb(null, list);
};

inMemoryStore.prototype.findAndCheck = function (id, secret, cb) {
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
}

inMemoryStore.prototype.genToken = function () {
	var self = this;

	return Math.random().toString().slice(2);
}

inMemoryStore.prototype.findCheckGenToken = function (id, secret, cb) {
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
}
