var UserDB = require('../models/user');
var logger = require('../models/logger');
var _ = require('underscore');


// 注册
exports.showSignUp = function(req,res,next){

    var message = req.query.status ? '用户名不存在,您可以注册帐号':'注册';
    res.render('signUp',{
        title: '注册页面',
        noNavbar: true,
        message: message
    })
};

// 注册
exports.signUp = function(req,res,next){
    var _user = req.body.user;
    logger.info(_user);

    if(_user.name == "" || _user.password == ""){
        return res.redirect('/signup');
    }

    UserDB.find({name:_user.name},function(err,exitUser){
        if(err){
            logger.error(err);
            next(err);
        }
        //如果用户存在，跳到登录页面；否则新建用户，跳到首页
        if(exitUser.length){
            logger.warn('您已经注册可以直接登录',exitUser);
            res.redirect('/signin?status=1');
        }
        else{
            var user = new UserDB(_user);
            user.save(function(err,user){
                if(err){
                    logger.error(err);
                }
                res.redirect('/');
            });

        }
    });
};

// 注册
exports.showSignIn = function(req,res,next){

    var message = '您尚未登录，请登录';
    var status = req.query.status;
    if(status){
        logger.info('status:',status );
        switch(Number(status)){
            case 0: message = '您的权限不够，请重新登录';
            break;
            case 1: message = '您已经注册可以直接登录';
            break;
            case 2: message = '您的密码输入错误，请重新登录';
            break;
        }
    }
    res.render('signIn',{
        title: '登录页面',
        noNavbar: true,
        message: message
    })
};


// 登录
exports.signIn = function(req,res,next){
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    // logger.info(req);
    if(_user.name == "" || _user.password == ""){
        return res.redirect('/signup');
    }


    UserDB.findOne({name:_user.name},function(err,exitUser){
        if(err){
            logger.error(err);
        }
        //如果没找到用户,跳到注册页面
        if(exitUser==null){
            logger.warn('用户名不存在,您可以注册帐号');
            res.redirect('/signup?status=1');
        }
        else{
            //如果找到了用户名，比较密码
            logger.info(exitUser);
            exitUser.comparePassword(password,function(err,isMatch){
                if(err){
                    logger.error(err);
                    next(err);
                }
                if(isMatch){
                    logger.info('登录成功');
                    req.session.user = exitUser;
                    res.redirect('/');
                    //res.send(),登录成功信息，原地刷新页面
                    //
                    //
                    //
                    //
                    //
                }
                else{
                    //到登录页面重新登录
                    logger.warn('您的密码输入错误，请重新登录');
                    res.redirect('/signin?status=2');

                }
            });
        }

    });

    return;
};

// 登出
exports.logOut = function(req,res,next){
    delete req.session.user;
    //delete app.locals.user;
    res.redirect('/');
};



exports.userProductList = function(req,res,next){
    var reqUser = req.session.user;
    var userId = reqUser._id;

    if(userId){
        UserDB
            .find({_id: userId})
            .populate({
                path: 'products',
                select: 'user'
            })
            .exec(function(err,users){
                if(err){
                    logger.error(err);
                    return next(err);
                }
                var _user = users[0] || {};
                var userName = _user.name;
                var _products = _user.products || [];
                // var results = _products.slice(index,index+count);
                res.render('adminList',{
                    title: '列表页',
                    productList: _products
                });
            })
    }

}

// 用户列表
exports.userList = function(req,res,next){

    UserDB.fetch(function(err,users){
        if(err){
            logger.error(err);
            next(err);
        }
        res.render('userList',{
            title: '用户列表页',
            userList: users
        });
    });

};

exports.signinRequired = function(req,res,next){
    var user = req.session.user;

    //logger.info(req);
    logger.info(user);

    if(!user){
        logger.info('您尚未登录,请登录');
        return res.redirect('/signin');
    }
    next();
};

exports.adminRequired = function(req,res,next){
    var user = req.session.user;
    if(user.role < 0 ){
        logger.info('您的权限不够，请重新登录');
        return res.redirect('/signin?status=0');
    }
    next();
};
