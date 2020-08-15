const { Select, Insert, Update } = require('../utils/sql');

const userService = {
    // 用户表查询用户信息
    selectUserSheet: async (req, res, params) => {
        let { phone } = params;
        let data = await req.mysql(Select(['*'], ['user'], { phone: phone }));
        return data;
    },
    // 用户表新增用户信息
    insertUserSheet: async (req, res, params) => {
        let { phone, name, password } = params;
        let data = await req.mysql(Insert('user', [ 'phone', 'name', 'password' ], [ phone, name, password ]));
        return data;
    },
    // 登陆表新增登录信息
    insertLoginSheet: async (req, res, params) => {
        let { name, phone, token, terminal, login_status } = params;
        let data = await req.mysql(Insert('login', [ 'phone', 'name', 'token', 'terminal', 'login_status' ], [ phone, name, token, terminal, login_status ]));
        return data;
    },
    // 退出登录
    loginOutLoginSheet: async (req, res, params) => {
        let data = await req.mysql(Update('login', { login_status: '2' }, { phone: params.phone }));
        return data;
    },
    // 查询是否存在登录信息
    selectLoginSheet: async (req, res, params) => {
        let data = await req.mysql(Select(['*'], ['login'], { phone: params.phone }));
        return data;
    },
    // 登陆时更新login表
    updateLoginSheet: async (req, res, params) => {
        let { phone, token, terminal, login_status } = params;
        let data = await req.mysql(Update('login', { token: token, terminal: terminal, login_status: login_status }, { phone: phone }, ','));
        return data;
    }
}

module.exports = userService;