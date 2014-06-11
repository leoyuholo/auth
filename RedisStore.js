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

RedisStore.prototype.destroy = function () {
	var self = this;

	self.client.quit();

};

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

};
