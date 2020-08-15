const { getReqUA } = require('../utils/utils.js');
const { Select, Update } = require('../utils/sql');
const resMap = require('../utils/resMap.js');
const jwt = require('jsonwebtoken');

/**
 * 验证登录状态，如果未登录则需要登录，登录有效期可以配置
 */
module.exports = async function (req, res, next) {
    // 用户登录注册相关接口不做校验
    if (req.path.indexOf('user') != -1) {
        next()
    } else {
        if (req.session.phone) {
            let { clientName } = getReqUA(req);
            let data = await req.mysql(Select(['*'], ['login'], { phone: req.session.phone, terminal: clientName, login_status: '1' })); 
            if (data.length) {
                let { token } = data[0];
                // 当前终端类型一样是，校验token是否过期
                jwt.verify(token, 'fast_mail', async function(err, decoded) {
                    if (err) {
                        res.rsend(resMap('20004', { msg: '登录失效，请重新登录' }))
                    } else {
                        // 如果在登录状态内，任何请求会实时刷新token
                        let token = jwt.sign({ name: req.session.name, phone: req.session.phone }, 'fast_mail', { expiresIn: 24 * 60 * 60 });
                        await req.mysql(Update('login', { token: token }, { phone: req.session.phone }));
                        next()
                    }
                })
            } else {
                res.rsend(resMap('20004', { msg: '登录失效，请重新登录' }))
            }
        } else {
            res.rsend(resMap('20004', { msg: '登录失效，请重新登录' }))
        }
    }
}