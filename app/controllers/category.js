var ProductDB = require('../models/product');
var CommentDB = require('../models/comment');
var CategoryDB = require('../models/category');
var logger = require('../models/logger');
var _ = require('underscore');




// 分类 页
exports.categoryNew = function (req,res,next){
    var data = {
        name: ''
    };
    res.render('categoryAdmin',{
        title: "芝士范 分类录入页",
        category: data
    });

};

// 分类 保存
exports.categorySave = function (req,res,next){
    var reqCategory = req.body.category;
    var _category = new CategoryDB(reqCategory);

    _category.save(function(err,category){
        if(err){
            logger.error(err);
            //需要提示保存失败
            return next();
        }
        //重定向到新页面
        res.redirect('/admin/category/list/');
    });
};

//list page
exports.categoryList = function (req,res,next){

    CategoryDB.fetch(function(err,categories){
        if(err){
            logger.error(err);
            return next(err);
        }
        res.render('categoryList',{
            title: '分类列表页',
            categoryList: categories
        });
    });

};
