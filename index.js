var express = require('express'),
	bodyParser = require('body-parser'),
	path = require('path'),
	auth = require('./auth.js'),
	app = express(),
	port = 8080;

app.use(bodyParser());
app.use(express.static(path.join(__dirname + '/www')));

if ('development' === app.settings.env) {
	app.use('/test', express.static(path.join(__dirname + '/test')));
}

app.get('/list', function (req, res) {
	var obj = auth.list();
	res.send(obj);
});

app.post('/create', function (req, res) {
	var obj = auth.create(req.param('id'), req.param('pw'));
	res.send(obj);
});

app.post('/update', function (req, res) {
	var obj = auth.update(req.param('id'), req.param('secret'), req.param('newId'), req.param('newPw'));
	res.send(obj);
});

app.post('/delete', function (req, res) {
	var obj = auth.delete(req.param('id'), req.param('secret'));
	res.send(obj);
});

app.get('/loginchallenge', function (req, res) {
	var obj = auth.loginchallenge(req.param('id'));
	res.send(obj);
});

app.post('/login', function (req, res) {
	var obj = auth.login(req.param('id'), req.param('secret'));
	res.send(obj);
});

app.post('/logout', function (req, res) {
	var obj = auth.logout(req.param('id'), req.param('token'));
	res.send(obj);
});

app.listen(port);

console.log('auth running on port:', port);
