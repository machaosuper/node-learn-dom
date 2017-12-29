// var Movie = require('../models/movie');
// var User = require('../models/user');
// var _ = require('underscore');
var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var Comment = require('../app/controllers/comment');

module.exports = function (app) {
	// 拦截器
	app.use(function (req, res, next) {
		// console.log('拦截器');
		// console.log(req.session.user);
		var _user = req.session.user;
		// if (_user) {
		app.locals.user = _user;
		// }
		return next();
	})

	/*
	 * 注册
	 * @param name 用户名
	 * @param password 密码
	 */
	app.post('/user/signup', User.signup)


	/*
	 * 登录
	 * @param name 用户名
	 * @param password 密码
	 */
	app.post('/user/signin', User.signin)

	app.get('/signup', User.showSignup)
	app.get('/signin', User.showSignin)

	app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)

	/*
	 * 登出
	 * @param name 用户名
	 * @param password 密码
	 */
	app.get('/user/logout', User.logout)

	app.get('/', Index.index);

	app.get('/movie/:id', Movie.detail)

	app.post('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new)

	app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update)

	app.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.save)

	app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)

	app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)	




	// Comment
	app.post('/movie/comment', User.signinRequired, Comment.save)
}

