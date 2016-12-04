# echeese site

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


###页面地址

|#|页面|url|
|---|---|---|
|1|首页|http://localhost:3000
|2|录入页|http://localhost:3000/admin
|3|详情页|http://localhost:3000/product/:id
|4|列表页|http://localhost:3000/list

###流程
+ 在录入页中录入数据保存
+ 在首页、列表页中可查看所有类目
+ 在详情页中查看单个数据

###  如何开发一个页面

请参考views/pages/detail.jade

###Todo

+ 构建（cdn）
+ 部署or打包
+ 同构。。。
