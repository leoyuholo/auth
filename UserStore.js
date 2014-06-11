// Abstract class of user data store

var crypto = require('crypto'),
	aes = require('crypto-js/aes');

module.exports = UserStore;

function UserStore(config) {

}

UserStore.prototype.find = function (id, cb) {
	
};

UserStore.prototype.add = function (id, pw, cb) {
	
};

UserStore.prototype.modify = function (user, newId, newPw, cb) {
	
};

UserStore.prototype.remove = function (user, cb) {
	
};

UserStore.prototype.list = function (cb) {
	
};

UserStore.prototype.findAndCheck = function (id, secret, cb) {
	
};

UserStore.prototype.getChallenge = function (user, cb) {
	
};

UserStore.prototype.findCheckGenToken = function (id, secret, cb) {
	
};

UserStore.prototype.clearToken = function (user, cb) {

};

UserStore.prototype.genKey = function (pw) {
	var salt = (Math.random().toString().slice(2) + '00000000000000000000000000000000').slice(0, 32),
		key = crypto.createHash('sha1').update(pw + salt).digest('hex');

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
