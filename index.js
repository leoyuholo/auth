var express = require('express'),
	bodyParser = require('body-parser'),
	auth = require('./auth.js'),
	app = express();

app.use(bodyParser());

app.get('/', function(req, res) {
	res.sendfile('./index.html');
})

app.get('/auth_web.js', function(req, res) {
	res.sendfile('./auth_web.js');
})

app.get('/list', function(req, res) {
	var obj = auth.list();
	res.send(obj);
});

app.post('/create', function(req, res) {
	var obj = auth.create(req.param('id'), req.param('pw'));
	res.send(obj);
});

app.post('/login', function(req, res) {
	var obj = auth.login(req.param('id'), req.param('pw'));
	res.send(obj);
});

app.post('/logout', function(req, res) {
	var obj = auth.logout(req.param('id'), req.param('token'));
	res.send(obj);
});

var port = 8080;
app.listen(port);

console.log('auth running on port:', port);
