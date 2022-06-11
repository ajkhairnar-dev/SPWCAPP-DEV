const express = require('express')
const profile = express.Router()
const {verifyAccessToken} = require('../common/jsonwebtoken');
const { chagepassValidation} = require('../schema/profile/profile.validation');
const { changePassword } = require('../controller/profile/changepassword.controller')
const { updateProfile} = require('../controller/profile/updateprofile.controller');


profile.post(basepath+'/changepassword',chagepassValidation,verifyAccessToken,changePassword) 
profile.post(basepath+'/updateprofile',verifyAccessToken,updateProfile) 


module.exports = profile