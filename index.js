var express = require('express'),
	bodyParser = require('body-parser'),
	auth = require('./auth.js'),
	app = express();

app.use(bodyParser());
app.use(express.static(__dirname));

app.get('/list', function(req, res) {
	var obj = auth.list();
	res.send(obj);
});

app.post('/create', function(req, res) {
	var obj = auth.create(req.param('id'), req.param('pw'));
	res.send(obj);
});

app.get('/loginchallenge', function(req, res) {
	var obj = auth.loginchallenge(req.param('id'));
	res.send(obj);
});

app.post('/login', function(req, res) {
	var obj = auth.login(req.param('id'), req.param('secret'));
	res.send(obj);
});

app.post('/logout', function(req, res) {
	var obj = auth.logout(req.param('id'), req.param('token'));
	res.send(obj);
});

var port = 8080;
app.listen(port);

console.log('auth running on port:', port);
