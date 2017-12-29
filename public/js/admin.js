$(function () {
	$('.del').click(function (e) {
		// debugger;
		// var id = $(this).attr('data-id');
		// var id = $(this).data('id');
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id)
		$.ajax({
			type: 'DELETE',
			url: '/admin/movie/list?id=' + id
		}).done(function (res) {
			if (res.code === '000000') {
				if (tr.length > 0) {
					tr.remove()
				}
			}
		})
	})
})