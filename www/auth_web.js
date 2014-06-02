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

var urlAjax = function(url, onSuccess, onFail) {
	$.ajax({
		url: url
	}).done(processRes(onSuccess, onFail));
}

var postAjax = function(url, payload, onSuccess, onFail) {
	$.post(url, payload, processRes(onSuccess, onFail));
}

var sha1 = function(data) {
	return CryptoJS.SHA1(data).toString();
}

var aesDecrypt = function(input, key) {
	return CryptoJS.AES.decrypt(input, key);
}

var challengeSecret = function(id, pw, onSuccess, onFail) {
	urlAjax('/loginchallenge?id=' + id, function(data) {
		var secret = '',
			aesKey = sha1(sha1(pw) + data.salt);
		try {
			secret = aesDecrypt(data.challenge, aesKey).toString(CryptoJS.enc.Utf8);
		} catch (err) {
			onFail({msg: 'Incorrect password.'});
		}
		onSuccess(secret);
	}, onFail);
}

auth = {

	create: function(id, pw, onSuccess, onFail) {
		if (id && pw) {
			postAjax('/create', {id: id, pw: sha1(pw)}, onSuccess, onFail);
		} else {
			onFail({msg: 'Empty ID or password.'});
		}
	},

	update: function(id, pw, newId, newPw, onSuccess, onFail) {
		if (id && pw && newId && newPw) {
			challengeSecret(id, pw, function(secret) {
				postAjax('/update', {id: id, secret: secret, newId: newId, newPw: sha1(newPw)}, onSuccess, onFail);
			}, onFail);
		} else {
			onFail({msg: 'Empty (new) ID or (new) password.'});
		}
	},

	login: function(id, pw, onSuccess, onFail) {
		if (id && pw) {
			challengeSecret(id, pw, function(secret) {
				postAjax('/login', {id: id, secret: secret}, onSuccess, onFail);
			}, onFail);
		} else {
			onFail({msg: 'Empty ID or password.'});
		}
	},

	logout: function(id, token, onSuccess, onFail) {
		postAjax('/logout', {id: id, token: token}, onSuccess, onFail);
	}
}