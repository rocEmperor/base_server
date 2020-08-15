/**
 * 示例：未启用
 * joi常用场景示例，具体api见文档
 * https://hapi.dev/module/joi/tester/
 */

let paramSchema = Joi.object().keys({ 
    // 3 - 30 个 数字、字符 
    username: Joi.string().alphanum().min(3).max(30).required(), 
    // 3 - 30 位 字母数字组合密码 
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/), 
    // string || number 都可以通过 
    access_token: [Joi.string(), Joi.number()], 
    // 生日限制 
    birthyear: Joi.number().integer().min(1900).max(2018), 
    // email 限制 
    email: Joi.string().email(), 
    // URI限制 
    website: Joi.string().uri({ scheme: [ 'git', /git+https?/ ] }), 
    // ==== 允许为空/ 否认不允许为空 ==== 
    search: Joi.string().allow(''), 
    // 验证枚举值，如果不传，默认为all 
    type: Joi.string().valid('disabled', 'normal', 'all').default('all'), 
    // 开始时间 会自动格式化 
    startTime: Joi.date().min('1-1-1974').max('now'), 
    // 结束时间 必须大于开始时间，小于2100-1-1 
    endTime: Joi.when(Joi.ref('startTime'), { is: Joi.date().required(), then: Joi.date().max('1-1-2100') }), 
    // 页码 限制最小值 
    page: Joi.number().integer().min(1).default(1), pageSize: Joi.number().integer().default(8), 
    // deleteWhenLtTen: Joi.number().integer().max(10).strip(), 
    // 数组中包含某个字段 && 数字 
    arrayString: Joi.array().items( 
        // 数组中必须包含 name1 
        Joi.string().label('name1').required(), 
        // 数组中必须包含 数字 
        Joi.number().required(), 
        // 除掉【以上类型的以外字段】---数组中可以包含其他类型，如bool
        Joi.any().strip() 
    ), 
    // 数组对象, 如需其参考以上字段 
    arrayObject: Joi.array().items( 
        Joi.object().keys({ 
            age: Joi.number().integer().max(200), 
            sex: Joi.boolean() 
        }) 
    )
})
.with('isA', 'AVal') //意思是，isA 和 AVal 这两字段如果填写了isA，也必须要填写AVal
.with('isB', 'BVal') //道理同上
.without('isA', 'isB') //意思是 isA 和 isB 只能填写其中一个    
.or('isA', 'isB') //意思是 isA 和 isB 这两字段至少填写其一

// 测试数据
const testData = { Password: "12345678"}
// 验证
let value = Joi.validate(testData, paramSchema, { allowUnknown: true, abortEarly: true });
console.log(value);
