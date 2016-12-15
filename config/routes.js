/**
* @file routes.js
* @author zx
* @description 路由文件
**/
var ProductDB = require('../app//models/product');
var UserDB = require('../app/models/user');
var logger = require('../app/models/logger');
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Product = require('../app/controllers/product');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');
var _ = require('underscore');


var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


module.exports = function(app){
    //预处理 passport, 如果拿到user 替换app.locals.user
    app.use(function (req, res, next){
        var _user = req.session.user;

        app.locals.user = _user;

        logger.info('user in app locals',app.locals.user,'user in session',req.session.user);
        return next();

    });


     /**
    * 前站
    * @主页
    * @详情创建页
    * @详情提交请求及登录检测
    * @详情提交成功后跳转到详情页
    *
    * @用户详情列表页
    *
    * @用户注册页面
    * @用户登录页面
    * @用户注册请求
    * @用户登录请求
    * @用户登出跳转
    **/
    // app.get('/',Index.index);
    app.get('/',Index.home);
    // product/new/可以直接填写，提交到 product/preview 时再验证是否登录
    app.get('/product/new',Product.productNew);
    // 验证登录状况，提交申请
    app.post('/user/product/preview',multipartMiddleware,User.signinRequired,Product.savePoster,Product.productPreview);
    // 申请提交成功，跳转详情页
    app.get('/user/product/:id',User.signinRequired,Product.detail);
    // // 详情页更新
    // app.get('/admin/product/update/:id',User.signinRequired,User.adminRequired,Product.productUpdate);

    // 用户查看自己提交的所有申请
    app.get('/user/productList',User.signinRequired,User.userProductList);
    // 用户的登录注册注销
    app.get('/signup',User.showSignUp);
    app.get('/signin',User.showSignIn);
    app.post('/user/signup',User.signUp);
    app.post('/user/signin',User.signIn);
    app.get('/user/logout',User.logOut);

    // app.post('/user/comment',User.signinRequired,Comment.save);

    // app.get('/results',Index.search);


    /**
    * 后台
    * @用户列表页面
    * @所有详情列表页
    * @分类创建页
    * @保存分类
    * @分类列表页面
    * @详情列表页删除详情
    **/

    app.get('/admin/user/list',User.signinRequired,User.adminRequired,User.userList);
    app.get('/admin/product/list',User.signinRequired,User.adminRequired,Product.productList);
    app.get('/admin/category/new',User.signinRequired,User.adminRequired,Category.categoryNew);
    app.post('/admin/category/save',User.signinRequired,User.adminRequired,Category.categorySave);
    app.get('/admin/category/list',User.signinRequired,User.adminRequired,Category.categoryList);

    app.delete('/admin/product/delete',User.signinRequired,User.adminRequired,Product.productDelete);

};

