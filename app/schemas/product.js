/**
*    @file product.js
*    @author zx
*    @description  item数据存储模式
**/
var mongoose = require('mongoose');
// 数据模式
var Schema = mongoose.Schema;
var objectId = Schema.Types.ObjectId;

var ProductSchema = new mongoose.Schema({
    title: String,
    description: String,
    poster: String,
    time: Number,
    category: {
        type: objectId,
        ref: 'Category'
    },
    user:{
        type: objectId,
        ref: 'User'
    },
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
ProductSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    else{
        this.meta.updateAt = Date.now();
    }

    next();
});

ProductSchema.statics = {
    //去数据库所有数据
    fetch: function(callback){
        return this.find({}).sort('meta.updateAt').exec(callback);
    }
    // // 取_id对应的数据
    // fetchById: function(id,callback){
    //     return this.findOne({_id:id}).exec(callback);
    // },
}

module.exports = ProductSchema;
