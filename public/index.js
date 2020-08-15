// 请求基础封装
function request (url, type = 'POST', data, cb) {
    $.ajax({
        url: url,
        timeout: 20000,
        type: type,
        data: data,
        success: function (data) {
            cb && cb(data)
        },
        complete: function (res) { },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    })
}

request(`/api`, 'POST', { name: 'ddd' }, function (data) {
    console.log(data, '/api响应数据')
})

//  ------------------------ 调试参数校验 -----------------------
request(`home/get-info`, 'POST', { 
    name: '刘羽琦',
    phone: '17712301236',
    code: 2548,
    arr: JSON.stringify([ true, 2, 3 ]),
    obj: JSON.stringify({ time: '2020-08' }) 
}, function (data) {
    console.log(data, 'home/get-info响应数据')
})

//  ------------------------ 调试文件上传 -----------------------
let fileDom = $('#file_id');
fileDom.on('change', function (e) {
    let current = fileDom[0].files[0];
    let formData = new FormData();
    formData.append('file_id', current)
    $.ajax({
        url: '/upload',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            console.log(data, 1000)
        },
        error: function (response) {
            console.log("error is :" + response);
        }
    })
})

// ---------------------- 登录注册退出功能 ----------------------------
// 获取表单值
function getFormVal (classPrefix) {
    let name = $(`.${classPrefix}_name`).val();
    let phone = $(`.${classPrefix}_phone`).val();
    let password = $(`.${classPrefix}_password`).val();
    return { name, phone, password }
}
// 非空验证
function checkNull (data) {
    let values = Object.values(data);
    let res = true;
    values.forEach((item) => {
        if (!item) {
            res = false
        }
    })
    return res;
}
// 校验表单数据有效性
function checkValid (data) {
    let res = { result: true, msg: '' };
    // 手机号
    if (!(/^1[3456789]\d{9}$/.test(data.phone))) {
        res = { result: false, msg: '手机号码有误，请重新输入' };
    }
    return res;
}
// 注册
$('.btn_register').click(() => {
    let data = getFormVal('register')
    if (!checkNull(data)) {
        alert('所有表单为必填项')
        return false;
    }
    if (!checkValid(data).result) {
        alert(checkValid(data).msg)
        return false;
    }
    request(`user/register`, 'POST', data, function (data) {
        if (data.result) {
            alert('注册成功')
        } else {
            alert(`注册失败`)
        }
    })
})
// 登录
$('.btn_login').click(() => {
    let data = getFormVal('login')
    if (!checkNull(data)) {
        alert('所有表单为必填项')
        return false;
    }
    if (!checkValid(data).result) {
        alert(checkValid(data).msg)
        return false;
    }
    request(`user/login`, 'POST', data, function (data) {
        console.log(data, '/login')
    })
})
// 退出
$('.btn_loginOut').click(() => {
    request(`user/loginOut`, 'POST', data, function (data) {
        console.log(data, '/register响应数据')
    })
})