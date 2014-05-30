auth = {
	create: function(id, pw, onSuccess, onFail) {
		$.ajax({
			url: '/create/' + id + '/' + pw
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
}