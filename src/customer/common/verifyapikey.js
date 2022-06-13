const config = require("../config/config.json");
const jwt = require('jsonwebtoken');

const verifyApiKey = async(req,res,next) => {
    const apikey = req.headers['apikey'];
    if(apikey != config.apikey){
        return res.status(400).send({ success:false,message:ecode.SYSC0000.msg, error_code:ecode.SYSC0000,data:{}})
    }
    next()
}

module.exports = {
    verifyApiKey
}