const homeService = require('../services/homeService');
const Validator = require('../utils/validator.js');
const resMap = require('../utils/resMap.js');

module.exports = {
    getInfo: async (req, res) => {
        // 入参校验
        const schema = new Validator({
            name: { string: true, max: 50, min: 0, required: true },
            phone: { string: true, max: 13, required: true, pattern: /^1[3456789]\d{9}$/ },
            code: { number: true, max: 10000, required: true },
            arr: { array: true },
            obj: { object: true },
        })
        schema.validate(req.body, async function (err, value) { 
            if (err) {
                res.rsend(resMap('20001', err))
            } else {
                console.log(`校验成功`)
                const data = await homeService.infoReq(req, res);
                res.rsend(resMap('20000', data));
            }
        }) 
    }
}