const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

const basePath = '/user';

router.post(`${basePath}/login`, userController.loginIn) // 登录
router.post(`${basePath}/register`, userController.register) // 注册
router.post(`${basePath}/loginOut`, userController.loginOut) // 退出

module.exports = router;