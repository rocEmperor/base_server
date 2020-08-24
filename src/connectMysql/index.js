/**
 * 连接mysql
 */
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password : '123456',
  database : 'fast_mail'
});
 
connection.connect(function(err) {
    if (err) {
        console.error('mysql 连接错误: ' + err.stack);
        return;
    }
    console.log('mysql 连接成功 connected as id ' + connection.threadId);
})

module.exports = connection;