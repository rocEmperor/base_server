const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

// 获取所有路由文件名
function findSync (startPath) {
    let result = [];
    let join = path.join;
    function finder (path) {
        let files= fs.readdirSync(path);
        files.forEach((val, index) => {
            let fPath= join(path, val);
            let stats= fs.statSync(fPath);
            if(stats.isFile()) result.push(val);
        });

    }
    finder(startPath);
    return result;
}
let routes = findSync(__dirname);
routes.forEach((item) => {
    if (item.indexOf('index.js') == -1) {
        router.use(require(`./${item}`));
    }
})

module.exports = router;