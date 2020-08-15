const express = require('express');
const router = express.Router();
const homeController = require('../controller/homeController');

const basePath = '/home';

router.post(`${basePath}/get-info`, homeController.getInfo)

module.exports = router;