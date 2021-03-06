// var Movie = require('../models/movie');
// var User = require('../models/user');
// var _ = require('underscore');
var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (app) {
	// 拦截器
	app.use(function (req, res, next) {
		// console.log('拦截器');
		// console.log(req.session.user);
		var _user = req.session.user;
		// console.log(_user)
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

	app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new)

	app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update)

	app.post('/admin/movie/save', User.signinRequired, User.adminRequired, multipartMiddleware, Movie.savePoster, Movie.save)

	app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)

	app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)	




	// Comment
	app.post('/movie/comment', User.signinRequired, Comment.save)



	// Category
	app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new)

	app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save)

	app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)


	// results
	app.get('/results', Index.search);

}
	