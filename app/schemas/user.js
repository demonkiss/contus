/**
*    @file user.js
*    @author zx
*    @description  用户数据模式
**/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectId = Schema.Types.ObjectId;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
// 数据模式
var UserSchema = new mongoose.Schema({
    name:{
        unique: true,
        type: String
    },
    password: String,
    // 0: normal user
    // 1: verified user
    // 2: professioner
    // >10: admin
    role: {
        type: Number,
        default: 0
    },
    products: [{
        type: objectId,
        ref: 'Product'
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
UserSchema.pre('save',function(next){

    var user = this;

    if(user.isNew){
        user.meta.createAt = user.meta.updateAt = Date.now();
    }
    else{
        user.meta.updateAt = Date.now();
    }

    //先生成随机盐，再加盐
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt){
        if(err) return next(err);


        //bcrypt 加盐哈希加密保存到password
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);
            user.password =  hash;
            next();
        });

    });
});

//实例方法
UserSchema.methods = {
    comparePassword: function(_password,callback){

        bcrypt.compare(_password, this.password, function(err,isMatch){
            if(err) return callback(err);

            callback(null,isMatch);
        });

    }
}

//静态方法，模型中用
UserSchema.statics = {
    //去数据库所有数据
    fetch: function(db){
        return this.find({}).sort('meta.updateAt').exec(db);

    },
    // 取_id对应的数据
    fetchById: function(db){
        return this.findOne({_id:id}).exec(db);

    },
}

module.exports = UserSchema;
