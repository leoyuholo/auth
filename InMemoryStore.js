var UserStore = require('./UserStore.js'),
	inherits = require('util').inherits,
	fs = require('fs');

module.exports = InMemoryStore;

inherits(InMemoryStore, UserStore);

function InMemoryStore(config) {
	var self = this;
	
	self.file = config.file;

	self.users = {};

	self.loadDB();

}

InMemoryStore.prototype.loadDB = function () {
	var self = this;

	fs.readFile(self.file, {encoding: 'utf-8'}, function (err, data) {

		if (err) {

			self.users = {};

		} else {

			self.users = data ? JSON.parse(data) : {};

		}

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

InMemoryStore.prototype.setUser = function (user, cb) {
	var self = this;

	self.users[user.id] = user;

	self.saveDB(function (err) {

		if (err)	return cb(err);

		return cb(null, user);
	});

};

InMemoryStore.prototype.getUser = function (id, cb) {
	var self = this;

	return cb(null, self.users[id]);
};

InMemoryStore.prototype.delUser = function (id, cb) {
	var self = this;

	delete self.users[id];

	self.saveDB(cb);

};
