var CommentDB = require('../models/comment');
var logger = require('../models/logger');
var _ = require('underscore');


// admin 预览
exports.save = function (req,res,next){
    var reqComment = req.body.comment;
    var productId = reqComment.product;

    //存储回复
    if(reqComment.commentId){
        CommentDB.findById(reqComment.commentId,function(err,_comment){
            var reply = {
                from: reqComment.from,
                to: reqComment.toId,
                content: reqComment.content
            }
            _comment.reply.push(reply);
            _comment.save(function(err,comment){
                if(err){
                    logger.error(err);
                    next(err);
                }
                //重定向到新页面
                res.redirect('/product/'+ productId);
            });
        });
    }
    else{
        //存储评论
        var _comment = new CommentDB(reqComment);
        _comment.save(function(err,comment){
            if(err){
                logger.error(err);
                next(err);
            }
            //重定向到新页面
            res.redirect('/product/'+ productId);
        });
    }

};

