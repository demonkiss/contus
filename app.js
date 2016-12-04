/**
* @file app.js
* @author zx
* @description 入口文件
**/
var express = require('express');
var port = process.env.PORT || 3000;
var path = require('path');

var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var globalConf = require('./config/global');
var logger = require('./app/models/logger');
var app = express();
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var fs = require('fs')
var dbUrl = 'mongodb://localhost/contus';

mongoose.connect(dbUrl);

app.locals.moment = require('moment');

// 视图模板setup
app.set('views','./app/views/pages');
app.set('view engine', 'jade');
app.enable('view cache');

// bodyParser
app.set('env', globalConf.env);
app.use(morgan(':method :url :status'));//打印请求状态
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

// session 关联 dB
app.use(session({
    secret: 'zhishifan',
    store: new mongoStore({
        url: dbUrl,
        ttl: 14 * 24 * 60 * 60, // session过期时间
        touchAfter: 24 * 3600, // session 更新时间，无论期间有多少次请求，除非 session数据有变化
        collection: 'sessions',
    }),
    saveUninitialized: false, // 没有数据存储是不会初始化session
    resave: false //不会保存没有修改的session
}));

// 开发环境设置
if('development' ===app.get('env')){
    app.locals.pretty =true; // 不要压缩
    mongoose.set('debug',true); //db状态
}

// 监听服务
app.use(serveStatic(path.join(__dirname, 'public')));
app.listen(port);
app.use(morgan('zhishifan started on port: ' + port));

// app路由
require('./config/routes')(app);



// 错误处理 handler
app.use(function (err, req, res, next) {
    var logMsg = err.stack || err;
    if (err.status && err.status === 404) {
        logger.warn(logMsg);
    } else {
        logger.error(logMsg);
    }
    res.status(err.status || 500);
    res.render('error', {
        status: err.status,
    });
});

