const { isArray, isString, erorrRequest, isObject } = require('./utils');

function joinArray (params, noParse = false) {
    !noParse && params && params.forEach((item, index) => {
        if (typeof item == 'string') {
            params[index] = `'${item}'`
        }
    })
    let res = '';
    if (params.length === 1) {
        res = params.join('');
    } else {
        res = params.join(',');
    }
    return res;
}

function joinObject (params, char = '&') {
    if (!params) { return false }
    let res = '';
    for (let k in params) {
        if (typeof params[k] == 'string') {
            params[k] = `'${params[k]}'`
        }
        res += `${k}=${params[k]}${char}`
    }
    res = res.substring(0, res.length - 1)
    return res;
}

/**
 * sql查询
 * @param {Array} keys 查询的字段名
 * @param {Array} tables 被查询的表
 * @param {Object} conditions 查询筛选条件
 * examples: Select([ 'name' ], [ 'base_info' ], { id: 1 });
 */
function Select (keys, tables, conditions) {
    let sqlString = '';
    if (!keys || !tables) {
        erorrRequest('Select_sql params has undefined !');
        return;
    } else {
        if (!isArray(keys) || !isArray(tables)) {
            erorrRequest('Select_sql params exist type error !');
            return;
        }
    }
    if (conditions) {
        sqlString = `SELECT ${joinArray(keys, true)} FROM ${joinArray(tables, true)} WHERE ${joinObject(conditions)}`;
    } else {
        sqlString = `SELECT ${joinArray(keys, true)} FROM ${joinArray(tables, true)}`;
    }
    
    return sqlString;
}
/**
 * 删除
 * @param {String} table 对应操作的表名
 * @param {Object} conditions 筛选删除的某一条表数据
 * examples: Delete('base_info', { id: 1 });
 */
function Delete (table, conditions) {
    let sqlString = '';
    if (!table || !conditions) {
        erorrRequest('Delete_sql params has undefined !');
        return;
    } else {
        if (!isString(table) || !isObject(conditions)) {
            erorrRequest('Delete_sql params exist type error !');
            return;
        } 
    }
    sqlString = `DELETE FROM ${table} WHERE ${joinObject(conditions)}`;
    return sqlString;
}
/**
 * 新增
 * @param {String} table 对应操作的表名
 * @param {Array} keys 对应插入行中的key
 * @param {Array} values 对应插入行中的value
 * examples: Insert('base_info', [ 'name' ], [ '张三' ]);
 */
function Insert (table, keys, values) {
    let sqlString = '';
    if (!table || !keys || !values) {
        erorrRequest('Insert_sql params has undefined !');
        return;
    } else {
        if (!isString(table) || !isArray(keys) || !isArray(values)) {
            erorrRequest('Insert_sql params exist type error !');
            return;
        } 
    }
    sqlString = `INSERT INTO ${table} ( ${joinArray(keys, true)} ) VALUES ( ${joinArray(values)} )`;
    return sqlString;
}
/**
 * 编辑
 * @param {String} table 对应操作的表名
 * @param {Object} files 对应操作行中的key，value; 例 field1=value1
 * @param {Object} conditions 查询筛选条件
 * examples: Update('base_info', { name: '网络' }, { id: 2 });
 */
function Update (table, files, conditions, char = '&') {
    let sqlString = '';
    if (!table || !files || !conditions) {
        erorrRequest('Update_sql params has undefined !');
        return;
    } else {
        if (!isString(table) || !isObject(files) || !isObject(conditions)) {
            erorrRequest('Update_sql params exist type error !');
            return;
        } 
    }
    sqlString = `UPDATE ${table} SET ${joinObject(files, char)} WHERE ${joinObject(conditions)}`;
    return sqlString;
}

module.exports = {
    Select,
    Delete,
    Insert,
    Update
}