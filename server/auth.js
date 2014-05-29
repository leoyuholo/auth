var users = {};

function add(id, pw) {
	users[id] = {id: id, pw: pw};
	return {result: true, id: id};
};

function list() {
	var list = [];
	for (id in users) {
		list.push(users[id]);
	}
	return list;
};

function find(id) {
	return users[id];
};

module.exports = {

	create: function(id, pw) {
		if(find(id)) {
			return {result: false, msg: 'id exist.'};
		} else {
			return add(id, pw);
		}
	},

	list: function() {
		return list();
	}
}