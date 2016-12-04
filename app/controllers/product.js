var ProductDB = require('../models/product');
var CommentDB = require('../models/comment');
var CategoryDB = require('../models/category');
var UserDB = require('../models/user');
var logger = require('../models/logger');
var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

//detail page
exports.detail = function (req,res,next){

    var reqId = req.params.id;
    var id = new mongoose.Schema.ObjectId(reqId).path;
    // logger.info(id);

    ProductDB.findById(id,function(err,product){
        if(err){
            logger.error(err);
            return next(err);
        }
        CommentDB
            .find({product: id})
            .populate('from','name')
            .populate('reply.from reply.to','name')
            .exec(function(err,comments){
                if(err){
                    logger.error(err);
                    return next(err);
                }
                var _product = _.extend({},product);
                var _comments = _.extend({},comments);

                return res.render('detail',{
                    title: _product.title,
                    product: _product,
                    comments: _comments
                });
        });
    });
};


//admin page
exports.productNew = function (req,res,next){
    var data = {
        categoryNew: '',
        title: '',
        time: '',
        description: ''
    };
    CategoryDB.find({}, function(err, categories) {
        res.render('admin',{
            title: "芝士范 录入页",
            categories: categories,
            product: data
        });

    })

};

// admin 更新页
exports.productUpdate = function (req,res,next){
    var reqId = req.params.id;
    if(reqId){
        ProductDB.findById(reqId,function(err,product){
            CategoryDB.find({},function(err,categories){
                res.render('admin',{
                    title: "芝士范 录入修改",
                    product: product,
                    categories: categories
                });
            });

        });
    }
};
exports.savePoster = function(req,res,next){
    var posterFile = req.files.uploadPoster;
    var filePath = posterFile.path;
    var originalFilename = posterFile.originalFilename;
    // logger.info(req);
    // logger.info(posterFile);
    // logger.info(filePath);
    // logger.info(originalFilename);
    if(originalFilename){
        fs.readFile(filePath,function(err, data){
            if(err){
                logger.error(err);
            }
            var timeStamp = Date.now();
            var type = posterFile.type.split('/')[1];
            var poster = timeStamp + '.' + type;
            var storePath = path.join(__dirname, '../../', '/public/upload/'+ poster);

            fs.writeFile(storePath,data,function(err){
                req.poster = poster;
                logger.info(storePath);
                next();
            })
        });
    }
    else{
        next();
    }

};

// admin 保存预览
exports.productPreview = function (req,res,next){
    // logger.info(req);
    var reqId = req.body.product._id;
    var reqProduct = req.body.product;
    var reqUser = req.session.user;
    var userId = reqUser._id;
    var _product;



    if(req.poster){
        reqProduct.poster = req.poster;
    }
    if(userId){
        reqProduct.user = userId;
    }
    if(reqId){
        ProductDB.findById(reqId,function(err,product){
            if(err){
                logger.error(err);
                return next(err);
            }
            //用新数据替换旧数据

            _product = _.extend(product,reqProduct);
            _product.save(function(err,product){
                if(err){
                    logger.error(err);
                    return next(err);
                }
                //重定向到新页面
                logger.info(String(product._id));
                res.redirect('/user/product/'+ String(product._id));
            });
        });
    }
    else{
        // 没有id，是新创建的单品
        _product = new ProductDB(reqProduct);

        var categoryId = reqProduct.category;
        // var categoryNew = reqProduct.categoryNew;
        // logger.info(_product);
        // 保存单品
        _product.save(function(err,product){
            // 数据存储失败
            if(err){
                logger.error(err);
                return next(err);
            }
            // 如果分类是已存在分类
            if (categoryId) {
                // 关联分类存储
                CategoryDB.findById(categoryId,function(err, category){
                    //分类关联存储失败
                    if(err){
                        logger.error(err);
                        return next(err);
                    }
                    if(userId) {
                        UserDB.findById(userId,function(err, user){
                            if(err){
                                logger.error(err);
                                return next(err);
                            }
                            user.products.push(product._id);
                            category.products.push(product._id);
                            category.save(function(err, categorySaved){
                                //重定向到新页面
                                user.save(function(err, userSaved){
                                    res.redirect('/user/product/'+ String(product._id));
                                })

                            });
                        })

                    }
                    else {
                        return next(err);
                    }

                });
            }
        });
    }


};


//list page
exports.productList = function (req,res,next){
    // var data = [{
    //     title: '小度WIFI',
    //     _id: 0,
    //     time: 2015,

    // }];
    ProductDB.fetch(function(err,products){
        if(err){
            logger.error(err);
            next(err);
        }
        res.render('adminList',{
            title: '列表页',
            productList: products
        });
    });

};

//list delete
exports.productDelete = function (req,res,next){
    var id = req.query.id;
    if(id){
        ProductDB.remove({
            _id: id
        }, function(err) {
            if (err) {
                logger.error(err);
                //res.send();//删除失败
                return
            }
            res.send({success: 1});
        });
    }
};
