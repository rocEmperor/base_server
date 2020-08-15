const moment = require('moment');
const { isArray, isObject } = require('./utils');
const { Insert } = require('./sql');

/**
 * 接口日志输出 将日志输出到mysql
 */
module.exports = async function (req, res, data = {}) {
    let time = moment().format('MM-DD-YYYY hh:mm:ss');
    let req_header = JSON.stringify(req.headers);
    let req_path = `${req.hostname}${req.path}`;
    let method = req.method;
    let req_params = '';
    if (method == 'POST') {
        req_params = JSON.stringify(req.body);
    } else if (method == 'GET') {
        req_params = JSON.stringify(req.query);
    }
    let res_body = isArray(data) || isObject(data) ? JSON.stringify(data) : data;
    let sql = Insert(
        'logs', 
        [ 'time', 'req_header', 'req_path', 'method', 'req_params', 'res_body' ], 
        [ time, req_header, req_path, method, req_params, res_body ]
    )
    await req.mysql(sql);
}