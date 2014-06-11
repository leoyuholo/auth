var UserStore = require('./UserStore.js'),
	inherits = require('util').inherits,
	pg = require('pg');

module.exports = PostgreStore;

inherits(PostgreStore, UserStore);

function PostgreStore(config) {
	var self = this;

	pg.connect(config.url, function (err, client) {

		self.client = client;

		var sql = 'CREATE TABLE IF NOT EXISTS users(id VARCHAR(100) PRIMARY KEY, key VARCHAR(100), salt VARCHAR(100), token VARCHAR(100), secret VARCHAR(100), challenge VARCHAR(100));';

		client.query(sql);

	});

}

PostgreStore.prototype.destroy = function () {
	var self = this;

	pg.end();

};

PostgreStore.prototype.setUser = function (user, cb) {
	var self = this,
		sql = '';

	function rollback (cb) {

		self.client.query('ROLLBACK', function (err) {

			return cb(err);
		});

	}

	self.client.query('BEGIN', function (err) {

		if (err)	return rollback(cb);

		process.nextTick(function () {

			sql = 'INSERT INTO users(id) SELECT $1 WHERE NOT EXISTS (SELECT id FROM users WHERE id = $2);';

			self.client.query(sql, [user.id, user.id], function (err, result) {

				if (err)	return rollback(cb);

				sql = "UPDATE users SET id=$1, key=$2, salt=$3, token=$4, secret=$5, challenge=$6 WHERE id=$7;";

				self.client.query(sql, [user.id, user.key, user.salt, user.token, user.secret, user.challenge, user.id], function (err, result) {
					
					if (err)	return rollback(cb);

					return self.client.query('COMMIT', cb);
				});

			});

		});

	});

};

PostgreStore.prototype.getUser = function (id, cb) {
	var self = this,
		sql = '',
		user = null;

	sql = 'SELECT * FROM users WHERE id = $1';

	self.client.query(sql, [id], function (err, result) {

		if (err)	return cb(err);

		if (result.rows.length > 0) {
			var row = result.rows[0];

			user = {
				id: row.id,
				key: row.key,
				salt: row.salt,
				token: row.token,
				secret: row.secret,
				challenge: row.challenge
			};

		}

		return cb(null, user);

	});

};

PostgreStore.prototype.delUser = function (id, cb) {
	var self = this,
		sql = '';

	sql = 'DELETE FROM users WHERE id = $1;';

	self.client.query(sql, [id], function (err, result) {
		
		return cb(err, result);
	});

};
