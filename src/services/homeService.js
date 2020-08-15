const { Select } = require('../utils/sql');

const homeService = {
    infoReq: async (req, res) => {
        let data = await req.mysql(Select(['*'], ['base_info']));
        return data;
    }
}

module.exports = homeService;