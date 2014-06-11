var expect = chai.expect;

var userPool = [
	{id: 'alice', pw: '1234'}, 
	{id: 'bob', pw: 'ABCD'}
];

function reset() {

	before(function (done) {
		var cnt = 0,
			cleanUp = function () {
				cnt++;
				if (cnt == userPool.length)	done();
			};
		userPool.forEach(function (user, index) {
			auth.delete(user.id, user.pw, cleanUp, cleanUp);
		});
	});
}

describe('auth', function () {

	describe('create', function () {

		reset();
		
		var user = userPool[0];

		it('should success and return id', function (done) {
			auth.create(user.id, user.pw, function (data) {
				expect(data.id).to.equal(user.id);
				return done();
			}, function (data) {
				expect('this callback should not be called').to.be.not.ok;
				return done();
			});
		});
	});
	
	describe('update', function () {

		reset();

		var user = userPool[0],
			newUser = userPool[1];

		it('should create id "alice" for later modification', function (done) {
			auth.create(user.id, user.pw, function (data) {
				expect(data.id).to.equal(user.id);
				return done();
			}, function (data) {
				expect('this callback should not be called').to.be.not.ok;
				return done();
			});
		});
	
		it('should success and return newId and token', function (done) {
			auth.update(user.id, user.pw, newUser.id, newUser.pw, function (data) {
				expect(data.id).to.equal(newUser.id);
				expect(data.token).to.be.a('string');
				return done();
			}, function (data) {
				expect('this callback should not be called').to.be.not.ok;
				return done();
			});
		});
	});

	describe('delete', function () {

		reset();

		var user = userPool[0];

		it('should create id "alice" for later deletion', function (done) {
			auth.create(user.id, user.pw, function (data) {
				expect(data.id).to.equal(user.id);
				return done();
			}, function (data) {
				expect('this callback should not be called').to.be.not.ok;
				return done();
			});
		});

		it('should success and return id', function (done) {
			auth.delete(user.id, user.pw, function (data) {
				expect('this callback should be called').to.be.ok;
				return done();
			}, function (data) {
				expect('this callback should not be called').to.be.not.ok;
				return done();
			});
		});
	});

	describe('login', function () {

		reset();

		var user = userPool[0];

		it('should create id "alice" for later login', function (done) {
			auth.create(user.id, user.pw, function (data) {
				expect(data.id).to.equal(user.id);
				return done();
			}, function (data) {
				expect('this callback should not be called').to.be.not.ok;
				return done();
			});
		});

		it('should sign in and return id and token', function (done) {
			auth.login(user.id, user.pw, function (data) {
				expect(data.id).to.equal(user.id);
				expect(data.token).to.be.a('string');
				return done();
			}, function (data) {
				expect('this callback should not be called').to.be.not.ok;
				return done();
			});
		});
	});

	describe('logout', function () {

		reset();

		var user = userPool[0],
			token = '';

		it('should create id "alice" for later login/logout', function (done) {
			auth.create(user.id, user.pw, function (data) {
				expect(data.id).to.equal(user.id);
				return done();
			}, function (data) {
				expect('this callback should not be called').to.be.not.ok;
				return done();
			});
		});

		it('should sign in and return id and token', function (done) {
			auth.login(user.id, user.pw, function (data) {
				expect(data.id).to.equal(user.id);
				expect(data.token).to.be.a('string');
				token = data.token;
				return done();
			}, function (data) {
				expect('this callback should not be called').to.be.not.ok;
				return done();
			});
		});

		it('should sign out and return empty', function (done) {
			auth.logout(user.id, token, function (data) {
				expect(data).to.be.an('undefined');
				return done();
			}, function (data) {
				expect('this callback should not be called').to.be.not.ok;
				return done();
			});
		});
	});
});