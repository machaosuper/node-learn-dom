var Movie = require('../models/movie');
var Category = require('../models/category');
var Comment = require('../models/comment');
var _ = require('underscore');


exports.detail = function (req, res) {
	var id = req.params.id;
	Movie.findById(id, function (err, movie) {
		if (err) {
			console.log(err);
		}

		Comment.find({'movie': id}).populate('from', 'name').populate('reply.from reply.to', 'name').exec(function (err, comments) {
			// console.log(comments[2].reply);
			if (err) {
				console.log(err);
			}
			// console.log(movie);
			res.render('detail', {
				title: movie.title + '详情页',
				movie: movie,
				comments: comments
			})
		})
		
	})
}

exports.new = function (req, res) {
	Category.fetch(function (err, categories) {
		if (err) {
			console.log(err);
		}
		res.render('admin', {
			title: '后台录入页',
			movie: {},
			categories: categories
		})
	})
	
}

exports.update = function (req, res) {
	var id = req.params.id;

	if (id) {
		Movie.findById(id, function (err, movie) {
			if (err) {
				console.log(err);
			}
			Category.fetch(function (err, categories) {
				if (err) {
					console.log(err);
				}
				res.render('admin', {
					title: '后台更新页面',
					movie: movie,
					categories: categories
				})
			})
		})
	}
}

exports.save = function (req, res) {
	// console.log(req.body);
	var id = req.body.movie._id;
	var movieObj = req.body.movie
	// console.log(movieObj);
	var _movie
	// console.log('add movie');
	if (id) {
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
		_movie = new Movie(movieObj);

		var categoryId = movieObj.category;
		var categoryName = movieObj.categoryName;
		
			if (categoryId) {
				_movie.save(function (err, movie) {
					if (err) {
						console.log(err);
					}
					Category.findById(categoryId, function (err, category) {
						if (err) {
							console.log(err);
						}
						category.movies.push(movie._id);
						category.save(function (err, category) {
							res.redirect('/movie/' + movie._id);
						})
					})	
				})
			} else if (categoryName) {
				Category.findOne({name: categoryName}, function (err, category) {
					if (err) {
						console.log(err);
					}
					if (category) {
						_movie.category = category._id;
						_movie.save(function (err, movie) {
							if (err) {
								console.log(err);
							}
							category.movies.push(movie._id);
							category.save(function (err, category) {
								res.redirect('/movie/' + movie._id);
							})
						})
					} else {
						var _category = new Category({
							name: categoryName,
							movies: [movie._id]
						})
						_category.save(function (err, category) {
							_movie.category = category._id;
							_movie.save(function (err, movie) {
								if (err) {
									console.log(err);
								}
								res.redirect('/movie/' + movie._id);
							})
						})
					}
				})
			}
			
	}
		
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