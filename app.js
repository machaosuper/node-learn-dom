var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');


var mongoose = require('mongoose');


var dbUrl = 'mongodb://localhost/mac';

mongoose.connect(dbUrl);

var port = process.env.PORT || 3000;
var app = express();

// 日志
var logger = require('morgan');

// var connect = require('connect');

// sission
var session = require('express-session');
var cookieParser = require('cookie-parser');

var mongoStore = require('connect-mongo')(session);

app.use(cookieParser());
app.use(session({
	secret: 'mac',
	store: new mongoStore({
		url: dbUrl,
		ttl: 14 * 24 * 60 * 60, // = 14 days. Default
		collection: 'sessions'
	})
}));

var multer = require("multer");
app.use(multer());

// 文件上传插件
// var multer = require('multer');
// var storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 	    cb(null, './public/upload')
// 	},
// 	filename: function (req, file, cb) {
// 	    cb(null, file.originalFilename)
// 	}
// });
// var upload = multer({ storage: storage });
// var cpUpload = upload.any();
// app.use(cpUpload);



app.locals.moment = require('moment');

app.set('views', './app/views/pages');
app.set('view engine', 'jade');

// app.use(express.bodyParser());
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({extended: true}));


app.use(express.static(path.join(__dirname, 'public')))

app.listen(port);

if ('development' === app.get('env')) {
	app.set('showStackError');
	app.use(logger(':method :url :status'));
	app.locals.pretty = true;
	mongoose.set('debug', true);
}

require('./config/routes')(app);


console.log('service started on port ' + port);