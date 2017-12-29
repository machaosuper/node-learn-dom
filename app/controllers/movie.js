var Movie = require('../models/movie');
var _ = require('underscore');


exports.detail = function (req, res) {
	var id = req.params.id;
	Movie.findById(id, function (err, movie) {
		if (err) {
			console.log(err);
		}
		res.render('detail', {
			title: movie.title + '详情页',
			movie: movie
		})
	})
}

exports.new = function (req, res) {
	// console.log(req.body);
	var id = req.body.movie._id;
	var movieObj = req.body.movie
	var _movie
	// console.log('add movie');
	if (id !== 'undefined') {
		Movie.findById(id, function (err, movie) {
			if (err) {
				console.log(err);
			}

			_movie = _.extend(movie, movieObj);
			_movie.save(function (err, movie) {
				if (err) {
					console.log(err);
				}
				res.redirect('/movie/' + movie._id);
			})
		})
	} else {
		_movie = new Movie({
			title: movieObj.title,
			doctor: movieObj.doctor,
			county: movieObj.county,
			language: movieObj.language,
			year: movieObj.year,
			summary: movieObj.summary,
			flash: movieObj.flash,
			poster: movieObj.poster
		})

		_movie.save(function (err, movie) {
			if (err) {
				console.log(err);
			}
			res.redirect('/movie/' + movie._id);
		})
	}
}

exports.update = function (req, res) {
	var id = req.params.id;
	if (id) {
		Movie.findById(id, function (err, movie) {
			if (err) {
				console.log(err);
			}
			console.log(movie);
			res.render('admin', {
				title: '后台更新页面',
				movie: movie
			})
		})
	}
}

exports.save = function (req, res) {
	res.render('admin', {
		title: '后台录入页',
		movie: {
			title: '',
			doctor: '',
			county: '',
			language: '',
			year: '',
			summary: '',
			flash: '',
			poster: ''
		}
	})
}

exports.list = function (req, res) {
	Movie.fetch(function (err, movies) {
		if (err) {
			console.log(err);
		}
		res.render('list', {
			title: '后台列表页',
			movies: movies
		})
	})
}

exports.del = function (req, res) {
	// console.log(req.query);
	var id = req.query.id;
	if (id) {
		Movie.remove({_id: id}, function (err) {
			if (err) {
				console.log(err);
			} else{
				res.json({
					code: '000000'
				})	
			}
			
		})
	}
}