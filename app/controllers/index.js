var Movie = require('../models/movie');
var Category = require('../models/category');

exports.index = function (req, res) {
	Category.find({}).populate({path: 'movies', option: {limit: 5}}).exec(function (err, catetories) {
		if (err) {
			console.log(err);
		}
		res.render('index', {
			title: '首页',
			catetories: catetories
		})
	})
	// Movie.fetch(function (err, movies) {
	// 	if (err) {
	// 		console.log(err);
	// 	}
	// 	res.render('index', {
	// 		title: '首页',
	// 		movies: movies
	// 	})
	// })
}