var processRes = function(onSuccess, onFail) {
	return function(res) {
		if (res.result) {
			if (onSuccess)
				onSuccess(res.payload)
		} else {
			if (onFail)
				onFail(res.payload);
		}
	};
}

var postAjax = function(url, payload, onSuccess, onFail) {
	$.post(url, payload, processRes(onSuccess, onFail));
}

auth = {

	create: function(id, pw, onSuccess, onFail) {
		if (id && pw) {
			postAjax('/create', {id: id, pw: pw}, onSuccess, onFail);
		} else {
			onFail({msg: 'Empty ID or password.'});
		}
	},

	login: function(id, pw, onSuccess, onFail) {
		if (id && pw) {
			postAjax('/login', {id: id, pw: pw}, onSuccess, onFail);
		} else {
			onFail({msg: 'Empty ID or password.'});
		}
	},

	logout: function(id, token, onSuccess, onFail) {
		postAjax('/logout', {id: id, token: token}, onSuccess, onFail);
	}
}