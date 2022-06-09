const express = require('express')
const profile = express.Router()
const { chagepassValidation} = require('../schema/profile/profile.validation');
const { changePassword } = require('../controller/profile/changepassword.cotroller')
const {verifyAccessToken} = require('../common/jsonwebtoken');


profile.post(basepath+'/profile',chagepassValidation,verifyAccessToken,changePassword) 


module.exports = profile