const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); //引用中间件
const connection = require('./src/connectMysql'); // 连接数据库
const routes = require('./src/routers/index'); // 路由
const connectMiddleware = require('./src/middleware/connection');
const verifyLoginMiddleware = require('./src/middleware/verifyLogin'); // 统一的登录状态校验
const writeLog = require('./src/utils/writeLog');
const session = require("express-session");
const useragent = require('express-useragent');
const { Select, Insert, Delete, Update } = require('./src/utils/sql');

const app = new express();
const port = 10001;
const NODE_ENV = process.env.NODE_ENV;

// 静态文件
app.use(express.static('public'));

// 解析post请求体
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

// 解析cookie
app.use(cookieParser()); 

// 解析useragent
app.use(useragent.express());

app.use(session({
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    secret: 'lu-fast-mail.sid', // 一个 String 类型的字符串，作为服务器端生成 session 的签名。
    name: 'fast-mail-cookie.sid', // 返回客户端的 key 的名称，默认为 connect.sid,也可以自己设置。
    saveUninitialized: false,
    resave: false,   /*强制保存 session 即使它并没有变化,。默认为 true。建议设置成 false。*/
    // store: new RedisStore(redisStoreOption)
}))

// 将connection.query方法挂载到req上
app.use(connectMiddleware(connection));

app.use(function (req, res, next) {
    next()
})

// 重写res.send，在send之前，添加日志输出逻辑
app.use(function (req, res, next) {
    let copySend = res.send.bind(res);
    res.rsend = (data) => {
        // 输出接口日志
        writeLog(req, res, data)
        copySend(data)
    }
    next()
})

// 校验用户登录状态
app.use(verifyLoginMiddleware);

app.post('/api', function (req, res, next) {
    let sql = Update('base_info', { name: '天涯的尽头是风沙' }, { id: 15 });
    req.mysql(sql).then(function (data) {
        // console.log(data, 99991111)
    })
    console.log(req.session.name, 9000)
    if (!req.session.name) {
        req.session.name = '哈啊哈哈'
    }
    res.rsend({
        result: true,
        data: {
            name: '张三',
            age: 19
        }
    })
})

// 注册路由
app.use(routes);

app.listen(port, () => {
    console.log(`server start on 127.0.0.1:${port}`);
});