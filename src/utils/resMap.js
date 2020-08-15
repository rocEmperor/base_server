module.exports = function resMap (code, data = {}) {
    let map = {
        '20000': { // 成功响应
            code: '20000',
            errMsg: {},
            result: true,
            data: data
        },
        '20001': { // 参数错误输出
            code: '20001',
            errMsg: data,
            result: false
        },
        '20002': { // 上传文件失敗
            code: '20002',
            errMsg: data,
            result: false
        },
        '20003': { // 业务逻辑报错
            code: '20003',
            errMsg: data,
            result: false
        },
        '20004': { // 未登录
            code: '20004',
            errMsg: data,
            result: false
        },
        'other': { // 无效的状态码
            code: '20020',
            errMsg: { mag: '未定义业务状态码，谨慎使用' },
            result: true,
            data: data
        }
    }
    let res = map[code] || map['other'];
    return res;
}