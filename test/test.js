var expect = chai.expect;

function urlAjax(url, onSuccess, onFail) {
	$.ajax(url).done(function (res) {
		if (res.result) {
			if (onSuccess)
				onSuccess(res.payload)
		} else {
			if (onFail)
				onFail(res.payload);
		}
	});
}

function reset() {

	before(function (done) {
		urlAjax('/reset', done, function () {
			expect('this callback should not be called').to.be.not.ok;
			return done();
		});
	});
}

describe('auth', function () {

	describe('create', function () {

		reset();
		
		var id = 'alice',
			pw = '1234';

		it('should success and return id', function (done) {
			auth.create(id, pw, function (data) {
				expect(data.id).to.equal(id);
				return done();
			}, function (data) {
				expect('this callback should not be called').to.be.not.ok;
				return done();
			});
		});
	});
	
	describe('update', function () {

		reset();

		var id = 'alice',
			pw = '1234',
			newId = 'bob',
			newPw = 'ABCD';

		it('should create id "alice" for later modification', function (done) {
			auth.create(id, pw, function (data) {
				expect(data.id).to.equal(id);
				return done();
			}, function (data) {
				expect('this callback should not be called').to.be.not.ok;
				return done();
			});
		});
	
		it('should success and return newId and token', function (done) {
			auth.update(id, pw, newId, newPw, function (data) {
				expect(data.id).to.equal(newId);
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

		var id = 'alice',
			pw = '1234';

		it('should create id "alice" for later deletion', function (done) {
			auth.create(id, pw, function (data) {
				expect(data.id).to.equal(id);
				return done();
			}, function (data) {
				expect('this callback should not be called').to.be.not.ok;
				return done();
			});
		});

		it('should success and return id', function (done) {
			auth.delete(id, pw, function (data) {
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

		var id = 'alice',
			pw = '1234';

		it('should create id "alice" for later login', function (done) {
			auth.create(id, pw, function (data) {
				expect(data.id).to.equal(id);
				return done();
			}, function (data) {
				expect('this callback should not be called').to.be.not.ok;
				return done();
			});
		});

		it('should sign in and return id and token', function (done) {
			auth.login(id, pw, function (data) {
				expect(data.id).to.equal(id);
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

		var id = 'alice',
			pw = '1234',
			token = '';

		it('should create id "alice" for later login/logout', function (done) {
			auth.create(id, pw, function (data) {
				expect(data.id).to.equal(id);
				return done();
			}, function (data) {
				expect('this callback should not be called').to.be.not.ok;
				return done();
			});
		});

		it('should sign in and return id and token', function (done) {
			auth.login(id, pw, function (data) {
				expect(data.id).to.equal(id);
				expect(data.token).to.be.a('string');
				token = data.token;
				return done();
			}, function (data) {
				expect('this callback should not be called').to.be.not.ok;
				return done();
			});
		});

		it('should sign out and return empty', function (done) {
			auth.logout(id, token, function (data) {
				expect(data).to.be.an('undefined');
				return done();
			}, function (data) {
				expect('this callback should not be called').to.be.not.ok;
				return done();
			});
		});
	});
});