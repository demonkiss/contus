/**
*    @file comment.js
*    @author zx
*    @description
**/
var mongoose = require('mongoose');
// 数据模式
var Schema = mongoose.Schema;
var objectId = Schema.Types.ObjectId;
var CommentSchema = new mongoose.Schema({
    product: {
        type: objectId,
        ref: 'Product'
    },
    from: {
        type: objectId,
        ref: 'User'
    },
    to: {
        type: objectId,
        ref: 'User'
    },
    content: String,
    reply:[{
        from: {
            type: objectId,
            ref: 'User'
        },
        to: {
            type: objectId,
            ref: 'User'
        },
        content: String
    }],
    meta:{
        createAt:{
            type: Date,
            default: Date.now()
        },
        updateAt:{
            type: Date,
            default: Date.now()
        }
    }
});

// 数据存储方法
CommentSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    else{
        this.meta.updateAt = Date.now();
    }

    next();
});

CommentSchema.statics = {
    //去数据库所有数据
    fetch: function(db){
        return this.find({}).sort('meta.updateAt').exec(db);

    },
    // 取_id对应的数据
    fetchById: function(db){
        return this.findOne({_id:id}).exec(db);

    },
}

module.exports = CommentSchema;
