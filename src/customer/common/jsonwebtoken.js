const config = require("../config/config.json");
const jwt = require('jsonwebtoken');

const generateAccessToken = (token) => {
    return jwt.sign(token, config.jwt.key);
}

module.exports = {
    generateAccessToken
}