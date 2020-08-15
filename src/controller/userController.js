const userService = require('../services/userService');
const Validator = require('../utils/validator.js');
const resMap = require('../utils/resMap.js');
const jwt = require('jsonwebtoken');
const { getReqUA } = require('../utils/utils.js');

const schema = new Validator({
    name: { string: true, max: 20, min: 1, required: true },
    phone: { string: true, max: 13, required: true, pattern: /^1[3456789]\d{9}$/ },
    password: { string: true, max: 20, min: 6, required: true }
})

module.exports = {
    // 登录
    loginIn: async (req, res) => {
        schema.validate(req.body, async function (err, value) { 
            if (err) {
                res.rsend(resMap('20001', err))
            } else {
                let { name, phone } = req.body;
                // 校验当前是否已经注册
                const userData = await userService.selectUserSheet(req, res, req.body);
                if (!userData.length) {
                    res.rsend(resMap('20003', { msg: '当前用户不存在' }));
                } else {
                    let { password } = userData[0];
                    if (password != req.body.password) {
                        res.rsend(resMap('20003', { msg: '密码错误' }));
                        return false;
                    }
                    // 登录成功后将用户name和phone存到session里，同时将用户登录信息及token存到login表里（因为没装redies，暂时放到sql里）
                    // 这些信息将用于统一的登录校验使用
                    let { clientName } = getReqUA(req);
                    let token = jwt.sign({ name: name, phone: phone }, 'fast_mail', { expiresIn: 24 * 60 * 60 });
                    req.session.name = name,
                    req.session.phone = phone;
                    let loginData = await userService.selectLoginSheet(req, res, { phone });
                    if (loginData.length) { // 说明已存在登录信息，则直接update
                        await userService.updateLoginSheet(req, res, { phone, token, terminal: clientName, login_status: '1' });
                    } else {
                        await userService.insertLoginSheet(req, res, { name, phone, token, terminal: clientName, login_status: '1' });
                    }
                    let data = { token: token };
                    res.rsend(resMap('20000', data));
                }
            }
        })
    },
    // 退出
    loginOut: async (req, res) => {
        await userService.loginOutLoginSheet(req, res, req.body);
        res.rsend(resMap('20000', { msg: '退出成功' }))
    },
    // 注册
    register: async (req, res) => {
        schema.validate(req.body, async function (err, value) { 
            if (err) {
                res.rsend(resMap('20001', err))
            } else {
                let { name, phone } = req.body;
                // 校验当前是否已经注册
                const userData = await userService.selectUserSheet(req, res, req.body);
                if (userData.length) {
                    res.rsend(resMap('20003', { msg: '当前用户已注册' }));
                } else {
                    const insertRes = await userService.insertUserSheet(req, res, req.body);
                    if (insertRes.result) {
                        res.rsend(resMap('20000', { name, phone }));
                    }
                }
            }
        })
    }
}