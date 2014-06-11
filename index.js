var config = require('./config.json'),
	express = require('express'),
	bodyParser = require('body-parser'),
	path = require('path'),
	auth = new (require('./auth.js'))(config),
	app = express(),
	port = 8080;

app.use(bodyParser());
app.use(express.static(path.join(__dirname + '/www')));

if ('development' === app.settings.env) {
	app.use('/test', express.static(path.join(__dirname + '/test')));
}

app.post('/create', function (req, res) {
	auth.create(req.param('id'), req.param('pw'), function (err, obj) {
		res.send(obj);
	});
});

app.post('/update', function (req, res) {
	auth.update(req.param('id'), req.param('secret'), req.param('newId'), req.param('newPw'), function (err, obj) {
		res.send(obj);
	});
});

app.post('/delete', function (req, res) {
	auth.delete(req.param('id'), req.param('secret'), function (err, obj) {
		res.send(obj);
	});
});

app.get('/loginchallenge', function (req, res) {
	auth.loginchallenge(req.param('id'), function (err, obj) {
		res.send(obj);
	});
});

app.post('/login', function (req, res) {
	auth.login(req.param('id'), req.param('secret'), function (err, obj) {
		res.send(obj);
	});
});

app.post('/logout', function (req, res) {
	auth.logout(req.param('id'), req.param('token'), function (err, obj) {
		res.send(obj);
	});
});

app.listen(port);

console.log('auth running on port:', port);
