

module.exports = {

    appname: 'echeese',

    appdir: './',

    // appdir目录下的log目录
    dir: './log',

    // 采用info
    level: 'info',

    // 指定单个文件最大大小
    maxsize: 4 * 1024 * 1024 * 1024 * 1024,

    // 是否按照日期分割文件，只对默认的transport有用，支持按小时等切分日志
    dailyRotatePattern: '.yyyy-MM-dd'

};
