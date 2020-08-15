const multer = require('multer');
const path = require('path');
const moment = require('moment');
const resMap = require('../utils/resMap.js');

const storage = multer.diskStorage({
    // 文件存储路径
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads/files'));
    },
    // 修改上传文件的名字 file 是个文件对象 ,fieldname对应在客户端的name属性 存储的文件需要自己加上文件的后缀，multer并不会自动添加
    // 这里直接忽略文件的后缀.
    filename: function (req, file, cb) {
        cb(null, moment().format('YYYYMMDDhhmmss') + file.originalname);
    }
})

module.exports = {
    upload: async (req, res) => {
        // 注意：上传单张文件时，使用single，上传多张文件时使用array。
        // 更详细文档https://www.cnblogs.com/wjlbk/p/12633320.html
        // single和array的参数，是上传的文件流name，一定要和前端的formData设置的name相同，不然会报错
        const uploadIns = multer({ 
            storage: storage,
            limits: {
                files: 1, // 设置每次可上传文件数量
                fileSize: 20 * 1000 * 1024  // 设置文件大小不能超过(bytes)
            }
        }).single('file_id')
        uploadIns(req, res, function (err) {
            if (err) {
                res.rsend(resMap('20002', err))
            } else {
                res.rsend(resMap('20000', {
                    status: 1,
                    msg: '上传成功'
                }))
            }
        })
    }
}