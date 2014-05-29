var auth = require('./auth.js'),
	app = require('express')();

app.get('/', function(req, res) {
	res.sendfile('./index.html');
})

app.get('/list', function(req, res) {
	var obj = auth.list();
	res.send(obj);
});

app.get('/create/:id/:pw', function(req, res) {
	var obj = auth.create(req.params.id, req.params.pw);
	res.send(obj);
});

app.get('/login/:id/:pw', function(req, res) {
	var obj = auth.login(req.params.id, req.params.pw);
	res.send(obj);
});

app.get('/logout/:id/:token', function(req, res) {
	var obj = auth.logout(req.params.id, req.params.token);
	res.send(obj);
});

var port = 8080;
app.listen(port);

console.log('app running on port:', port);
