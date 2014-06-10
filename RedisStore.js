var UserStore = require('./UserStore.js'),
	inherits = require('util').inherits,
	redis = require('redis');

module.exports = RedisStore;

inherits(RedisStore, UserStore);

function RedisStore(config) {
	console.log('Redis', config);
}

RedisStore.prototype.find = function (id, cb) {
	
};

RedisStore.prototype.add = function (id, pw, cb) {
	
};

RedisStore.prototype.modify = function (user, newId, newPw, cb) {
	
};

RedisStore.prototype.remove = function (user, cb) {
	
};

RedisStore.prototype.list = function (cb) {
	
};

RedisStore.prototype.findAndCheck = function (id, secret, cb) {
	
};

RedisStore.prototype.getChallenge = function (user, cb) {
	
};

RedisStore.prototype.findCheckGenToken = function (id, secret, cb) {
	
};

RedisStore.prototype.clearToken = function (user, cb) {

};
