const config = require("../config/config.json");
const jwt = require('jsonwebtoken');

const generateAccessToken = async(token) => {
    try{
        return await jwt.sign(token, config.jwt.key,{ expiresIn: config.jwt.sessiontime });
    }catch(error){
        return res.status(400).send({ success:false,message:ecode.SYSC0001.desc, error_code:ecode.SYSC0001,data:{error:error}})
    } 
}

const verifyAccessToken = async(req,res,next) => {
    try{
        const token = req.body.token;
        await jwt.verify(token, config.jwt.key);
        next()
    }catch(error){
        return res.status(400).send({ success:false,message:ecode.SYSC0002.desc, error_code:ecode.SYSC0002,data:{error:error}})
    }
}

module.exports = {
    generateAccessToken,
    verifyAccessToken
}