const chalk = require('chalk')

function erorrRequest (err) {
    console.log(chalk.red(`request error: ${err} \n`))
}

function isArray (params) {
    let is = false;
    if (!params) { console.log('isArray params is undefined !'); return };
    let type = Object.prototype.toString.call(params);
    if (type === '[object Array]') {
        is = true;
    }
    return is;
} 

function isObject (params) {
    let is = false;
    if (!params) { console.log('isArray params is undefined !'); return };
    let type = Object.prototype.toString.call(params);
    if (type === '[object Object]') {
        is = true;
    }
    return is;
} 

function isString (params) {
    let is = false;
    if (!params) { console.log('isString params is undefined !'); return };
    let type = Object.prototype.toString.call(params);
    if (type === '[object String]') {
        is = true;
    }
    return is;
} 

//浏览器获取版本
function _getVersion(source, split) {
    try {
        var temp = source.split(split + '/')[1] || '';
        return temp.split(' ')[0];
    } catch (e) {
        console.error('获取浏览器版本错误：');
        console.error(e);
        return '';
    }
}

// 获取当前请求用户，使用终端类型
function getReqUA (req) {
    let ua = {};
    let source = req.useragent.source.toLowerCase();
    let clientName = 'web';
    if (source.match(/MicroMessenger/i) == "micromessenger") {
        clientVersion = _getVersion(source, 'micromessenger');
        clientName = 'wx';
    }
    ua.clientName = clientName;
    return ua;
}

module.exports = {
    erorrRequest,
    isArray,
    isString,
    isObject,
    getReqUA
}