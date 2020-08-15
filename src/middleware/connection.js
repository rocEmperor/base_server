/**
 * 判断当前执行sql类型
 */
function sqlType (sql, type) {
    if (!sql || !type) {
        return false;
    }
    return sql.indexOf(type) != -1;
}

module.exports = function connect (connection) {
    return function (req, res, next) {
        req.mysql = function (sql) {
            return new Promise (function (resolve, reject) {
                connection.query(sql, function (err, result) {
                    if(err){
                        console.log('[mysql Error] - ', err.message);
                        reject(err);
                        return;
                    }
                    let res;
                    // 查询场景 过滤从数据库取来的数据
                    if (sqlType(sql, 'SELECT')) {
                        res = [];
                        result.forEach((item, index) => {
                            res[index] = {};
                            for (let k in item) {
                                res[index][k] = item[k];
                            }
                        })
                    }
                    // 插入;删除；更新场景 过滤从数据库取来的数据
                    if (sqlType(sql, 'INSERT') || sqlType(sql, 'DELETE') || sqlType(sql, 'UPDATE')) {
                        res = {};
                        for (let k in result) {
                            res[k] = result[k]
                            res.result = true;
                        }
                    }
                    
                    resolve(res);
                });
            })
        }
        next();
    }
}