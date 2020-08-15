const express = require('express');
const router = express.Router();
const homeController = require('../controller/upload.js');

// 上传文件统一接口
router.post(`/upload`, homeController.upload)

module.exports = router;