const axios = require('axios');

module.exports = async (args, body) => {
    const { data } = await axios.post(args.msTeamsWebHook, body);
    return data;
}