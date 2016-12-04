var ProductDB = require('../models/product');
var CategoryDB = require('../models/category');
var logger = require('../models/logger');

exports.home = function(req,res,next){
    res.render('home',{
        title: 'Contus'
    });
};

exports.index = function(req,res,next){

    CategoryDB
        .find({})
        .populate({
            path: 'products',
            select: 'title poster',
            options:{ limit: 6}
        })
        .exec(function(err, categories){
            if(err){
                logger.error(err);
                return next(err);
            }
            res.render('index',{
                title: '芝士范',
                categories: categories
            });
        });
};

exports.search = function(req,res,next){

    var catId = req.query.cat;
    var page = Number(req.query.p) || 0;
    var count = 3;
    var index = page * count;
    var q = req.query.q;

    logger.info(page);

    if(catId){
        CategoryDB
            .find({_id: catId})
            .populate({
                path: 'products',
                select: 'title poster'
            })
            .exec(function(err, categories){
                if(err){
                    logger.error(err);
                    return next(err);
                }

                var _category = categories[0] || {};
                var keyWord = _category.name;
                var _products = _category.products || [];
                var results = _products.slice(index,index+count);
                var currentPage = page + 1;
                var totalPage = Math.ceil(_products.length / count);

                res.render('results',{
                    title: '芝士范 列表页',
                    keyWord: keyWord,
                    currentPage: currentPage,
                    totalPage: totalPage,
                    query: 'cat='+catId,
                    results: results
                });
            });
    }
    else{
        ProductDB
            .find({title: new RegExp(q + '.*', 'i')})
            .exec(function(err, _products){
                if(err){
                    logger.error(err);
                    return next(err);
                }

                var results = _products.slice(index,index+count);
                var currentPage = page + 1;
                var totalPage = Math.ceil(_products.length / count);

                res.render('results',{
                    title: '芝士范 列表页',
                    keyWord: q,
                    currentPage: currentPage,
                    totalPage: totalPage,
                    query: 'q='+ q,
                    results: results
                });
            });
    }


};
