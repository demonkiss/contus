# contus site

###特性
+ node.js 和 express
+ jade模板引擎
+ mongoDB 和 mongoose
+ bootstrap 样式
+ grunt


###需要的环境

node,mongoDB和grunt


###启动

启动你的mongoDB `mongod`

启动服务 `grunt`


###文件结构

```
.
├── LICENSE
├── README.md
├── app  #服务端
│   ├── controllers  #服务端路由和请求操作的控制器
│   │   ├── category.js  #分类所需的控制器
│   │   ├── comment.js  #评论控制器
│   │   ├── index.js  #主页相关控制器
│   │   ├── product.js  #详情产品相关控制器
│   │   └── user.js  #用户相关控制器
│   ├── models  #服务端model
│   │   ├── category.js  #分类模型
│   │   ├── comment.js  #评论的模型
│   │   ├── logger.js  #logger
│   │   ├── product.js  #产品详情的模型
│   │   └── user.js  #用户的模型
│   ├── schemas  #数据库格式
│   │   ├── category.js  #分类数据库的格式
│   │   ├── comment.js  #评论数据库的格式
│   │   ├── product.js  #产品详情数据库的格式
│   │   └── user.js  #用户数据库的格式
│   └── views  #视图文件
│       ├── includes  #
│       │   ├── head.jade  #head部分模板
│       │   └── header.jade  #header头部模板
│       ├── layout.jade  #页面的公共layout
│       └── pages  #具体页面模板
│           ├── admin.jade  #详情录入页模板
│           ├── adminList.jade  #列表页模板
│           ├── categoryAdmin.jade  #分类录入页模板
│           ├── categoryList.jade  #分类列表页模板
│           ├── detail.jade  #详情页模板
│           ├── home.jade  #主页模板
│           ├── index.jade  #暂废弃
│           ├── results.jade  #搜索结果模板，暂不用
│           ├── signIn.jade  #登录页模板
│           ├── signUp.jade  #注册页模板
│           └── userList.jade  #用户列表页模板
├── app.js  #服务端入口文件
├── bower.json  #bower 配置文件
├── config  #服务端全局相关的控制
│   ├── global.js  #全局配置
│   ├── logger.js  #日志logger
│   └── routes.js  #路由配置
├── gruntfile.js  #grunt 配置文件
├── log  #日志文件夹
├── node_modules
├── package.json
└── public  #静态文件目录
    ├── js
    │   ├── comment.js  #评论操作
    │   └── list.js  #列表操作
    ├── libs  #库文件
    │   ├── bootstrap
    │   └── jquery
    └── upload  #上传文件的存储目录
```


###页面地址

|#|页面|url|
|---|---|---|
|1|首页|http://localhost:3000/
|2|详情创建页|http://localhost:3000/product/new
|3|详情预览页|http://localhost:3000/user/product/:id
|4|用户中心列表页|http://localhost:3000/user/productList
|5|后台所有用户列表页|http://localhost:3000/admin/user/list
|6|后台所有详情列表页|http://localhost:3000/admin/product/list
|7|后台分类创建页|http://localhost:3000/admin/category/new
|8|后台分类列表页|http://localhost:3000/admin/category/list


###  如何开发一个页面

请参考views/pages/detail.jade

###Todo

+ 页面开发
+ 样式细节
+ 构建（cdn）
+ 部署or打包
