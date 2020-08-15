const { erorrRequest, isObject } = require('./utils');

/**
 * 自定义 参数校验类
 * demo: 
 * const schema = new Validator({
 *      name: { string: true, max: 50, min: 0, required: true },
 *      phone: { string: true, max: 13, required: true, pattern: /^1[3456789]\d{9}$/ },
 *      code: { number: true, max: 10000, required: true },
 *      arr: { array: true },
 *      obj: { object: true },
 * })
 * schema.validate(req.body, async function (err, value) { 
 *     if (err) {
 *         console.log('校验失败, 失败原因为:', err)
 *       } else {
 *         console.log(`校验成功`)
 *     }
 * }) 
 */
class luValidator {
    constructor (props = {}) {
        this.initRules = { ...props }
        this.errorData = {}
        this.errorFlag = false;
    }
    pushError (k, msg) {
        this.errorFlag = true;
        if (!this.errorData[k]) {
            this.errorData[k] = [];
            this.errorData[k].push(msg)
        }
    }
    // 校验字符串类型
    string (value, k, config) {
        if (!config) { return false }
        let type = Object.prototype.toString.call(value);
        if (type != '[object String]') {
            this.pushError(k, `${k}字段不是string`)
        }
    }
    // 校验数值型
    number (value, k, config) {
        if (!config) { return false }
        let type = Object.prototype.toString.call(value);
        if (type != '[object Number]') {
            this.pushError(k, `${k}字段不是number`)
        }
    }
    // 校验最大值 包括number最大值及字符串最大长度
    max (value, k, config) {
        if (!config) { return false }
        let type = Object.prototype.toString.call(value);
        if (type == '[object String]' && value.length > config) {
            this.pushError(k, `${k}字段超过最长限制`)
        }
        if (type == '[object Number]' && value > config) {
            this.pushError(k, `${k}字段超过最大值`)
        }
    }
    // 校验最小值 包括number最小值及字符串最小长度
    min (value, k, config) {
        if (!config) { return false }
        let type = Object.prototype.toString.call(value);
        if (type == '[object String]' && value.length < config) {
            this.pushError(k, `${k}字段低于最小长度限制`)
        }
        if (type == '[object Number]' && value < config) {
            this.pushError(k, `${k}字段低于最小值`)
        }
    }
    // 自定义正则校验
    pattern (value, k, config) {
        if (!config) { return false }
        let type = Object.prototype.toString.call(value);
        if (type == '[object String]' && value.length < config) {
            this.pushError(k, `${k}正则校验错误`)
        }
    }
    // 转换参数
    toggleParams (target) {
        // 木前只转换以下数据类型
        let typeMap = [ 'number', 'object', 'array' ];
        for (let k in this.initRules) {
            typeMap.forEach((item) => {
                if (this.initRules[k][item]) {
                    switch (item) {
                        case 'number': // 转数字
                        target[k] = target[k].replace(/[A-Z|a-z]|[\-+]|[\@+]|[\&+]/g, '')
                        target[k] = parseFloat(target[k])
                        break;
                        case 'object': // 转对象
                        target[k] = JSON.parse(target[k])
                        break; 
                        case 'array': // 转数字
                        target[k] = JSON.parse(target[k])
                        break;
                    }
                }
            })
        }
    }
    // 启动校验
    validate (target, cb) {
        if (!target) {
            erorrRequest('validate 方法缺少参数')
        }
        if (!isObject(target)) {
            erorrRequest('validate 方法参数格式错误')
        }
        // 第一步 先做非空校验 当缺少必填参数时 直接抛错返回
        let targetKeys = Object.keys(target);
        let rulesRequiredkey = [];
        for (let k in this.initRules) {
            if (this.initRules[k].required) {
                rulesRequiredkey.push(k)
            }
        }
        rulesRequiredkey.forEach((item) => {
            if (targetKeys.indexOf(item) == -1) {
                this.errorFlag = true;
                this.errorData[item] = `${item}参数为必填`
            }
        })
        if (this.errorFlag) {
            erorrRequest('validate 方法校验失败：缺少必填参数')
            cb && cb(this.errorData, {})
            return false;
        }
        // 第二步 将客户端传过来的number，object，array转换。因为经过网络传输，数据都被转成字符串，需要转成正常的格式
        // 注意：客户端如果传递object或者array，需要经过JSON.stringify()处理后才行
        try {
            this.toggleParams(target)
        } catch (err) {
            this.errorFlag = true;
            this.errorData.mag = `参数转换失败，注意对象或者数组需要经过JSON.stringify再传`
            if (this.errorFlag) {
                erorrRequest(`validate 方法校验失败：${err}`)
                cb && cb(this.errorData, {})
                return false;
            }
        }

        // 第三步 当前参数已经满足必填时 则校验参数类型是否合法
        for (let k in target) {
            let current = this.initRules[k];
            for (let i in current) {
                // 经过第一步和第二步，已经校验过非空和参数类型
                let notValidList = [ 'required', 'array', 'object', 'number' ];
                if (notValidList.indexOf(i) == -1) {
                    this[i](target[k], k, current[i])
                }
            }
        }
        if (this.errorFlag) {
            erorrRequest('validate 方法校验失败：参数类型有误')
            cb && cb(this.errorData, {})
            return false;
        }
        cb && cb(undefined, {
            status: 'success',
            des: '校验通过'
        })
    }
}

module.exports = luValidator;