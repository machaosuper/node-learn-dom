var Movie = require('../models/movie');
var Category = require('../models/category');
var Comment = require('../models/comment');
var _ = require('underscore');



var fs = require('fs')
var path = require('path')


exports.detail = function (req, res) {
	var id = req.params.id;
	Movie.update({_id: id}, {$inc: {pv: 1}}, function (err) {
		if (err) {
			console.log(err);
		}
	})
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
// 存储图片
exports.savePoster = function (req, res, next) {
	console.log(req.files);
	var posterData = req.files.uploadPoster;
	var filePath = posterData.path;
	// var originalname = posterData.originalname;
	var originalname = posterData.originalname || posterData.originalFilename;
	if (originalname) {
		fs.readFile(filePath, function (err, data) {
			var timestamp = Date.now();
			// var type = posterData.extension;
			var type = posterData.extension || posterData.type.split('/')[1];
			var poster = timestamp + '.' + type;
			var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);
			fs.writeFile(newPath, data, function (err) {
				req.poster = poster;
				next();
			})
		})
	} else {
		next();
	}
}

exports.save = function (req, res) {
	// console.log(req.body);
	var id = req.body.movie._id;
	var movieObj = req.body.movie
	// console.log(movieObj);
	var _movie

	var categoryId = movieObj.category;


	if (req.poster) {
		movieObj.poster = req.poster;
	}

	// console.log('add movie');
	if (id) {
		Movie.findById(id, function (err, movie) {
			if (err) {
				console.log(err);
			}
			var oldCategoryId = movie.category;


			_movie = _.extend(movie, movieObj);
			_movie.save(function (err, movie) {
				if (err) {
					console.log(err);
				}
				if (categoryId && (oldCategoryId != categoryId)) {
					Category.update({_id: oldCategoryId}, {'$pull': {movies: movie._id}}, function (err) {
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
				} else {
					res.redirect('/movie/' + movie._id);
				}
			})
		})
	} else {
		_movie = new Movie(movieObj);

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
						movies: [_movie._id]
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