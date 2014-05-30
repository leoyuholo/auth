var urlAjax = function(url, onSuccess, onFail) {
	$.ajax({
		url: url
	}).done(function(res) {
		if (res.result) {
			if (onSuccess)
				onSuccess(res.payload)
		} else {
			if (onFail)
				onFail(res.payload);
		}
	});
}

auth = {

	create: function(id, pw, onSuccess, onFail) {
		urlAjax('/create/' + id + '/' + pw, onSuccess, onFail);
	},

	login: function(id, pw, onSuccess, onFail) {
		urlAjax('/login/' + id + '/' + pw, onSuccess, onFail);
	},

	logout: function(id, token, onSuccess, onFail) {
		urlAjax('/logout/' + id + '/' + token, onSuccess, onFail);
	}
}