var User = require('../models/user');

exports.signup = function (req, res) {
	var _user = req.body.user;
	// req.param('user')
	User.findOne({name: _user.name}, function (err, user) {
		if (err) {
			console.log(err);
		}
		if (user) {
			// console.log(user);
			return res.redirect('/signin');
		} else {
			var user = new User(_user);
			user.save(function (err, user) {
				if (err) {
					console.log(err);
				}
				res.redirect('/');
			})
		}
	})	
}


exports.showSignup = function (req, res) {
	res.render('signup', {
		title: '注册'
	})

}

exports.showSignin = function (req, res) {
	res.render('signin', {
		title: '登录'
	})
}

/*
 * 登录
 * @param name 用户名
 * @param password 密码
 */
exports.signin = function (req, res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	User.findOne({name: name}, function (err, user) {
		if (err) {
			console.log(err);
		}
		if (!user) {
			return res.redirect('/signup');
		}
		user.comparePassword(password, function (err, isMatch) {
			if (err) {
				console.log(err);
			}
			if (isMatch) {
				req.session.user = user;
				return res.redirect('/');
			} else {
				return res.redirect('/signin');
				console.log('密码不正确');
			}
		})
	})
}

/*
 * 登出
 * @param name 用户名
 * @param password 密码
 */
exports.logout = function (req, res) {
	delete req.session.user;
	// delete app.locals.user;
	res.redirect('/');
}


exports.list = function (req, res) {
	User.fetch(function (err, users) {
		if (err) {
			console.log(err);
		}
		res.render('userlist', {
			title: '用户列表页',
			users: users
		})
	})
}
// 登录
exports.signinRequired = function (req, res, next) {
	var user = req.session.user;
	if (!user) {
		return res.redirect('/signin')
	}
	next ()
}
// 权限
exports.adminRequired = function (req, res, next) {
	var user = req.session.user;
	if (user.role <= 10) {
		return res.redirect('/signin')
	}
	next ()
}
