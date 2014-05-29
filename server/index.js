var auth = require('./auth.js'),
	app = require('express')();

app.get('/', function(req, res) {
	var obj = auth.list();
	res.send(obj);
});

app.get('/create/:id/:pw', function(req, res) {
	var obj = auth.create(req.params.id, req.params.pw);
	res.send(obj);
});

var port = 8080;
app.listen(port);

console.log('app running on port:', port);
