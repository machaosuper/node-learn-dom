var Comment = require('../models/comment');


exports.save = function (req, res) {
	var comment = req.body.comment;
	console.log(comment);
	var movieId = comment.movie;
	var _comment = new Comment(comment);
	_comment.save(function (err, comment) {
		if (err) {
			console.log(err);
		}
		res.redirect('/movie/' + movieId);
	})
}