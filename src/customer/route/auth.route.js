const express = require('express')
const auth = express.Router()
const { loginOne,loginTwo } = require('../controller/auth/login.controller')
const {loginOneValidation,loginTwoValidation } = require('../schema/auth/login.validation');

const {registration,otpVerify,setPassword} = require('../controller/auth/registration.controller')
const {registrationValidation,otpValidation,setpasswordValidation } = require('../schema/auth/registration.validation');

const {forgotpassword,forgototpVerify,forgotsetPassword} = require('../controller/auth/forgotpassword.controller')
const {forgotpassValidation,forgototpValidation,forgotsetpassValidation } = require('../schema/auth/forgotpassword.validation');


//router.method('path',middleware,method)
//-------- login -----------
auth.post(basepath+'/login',loginOneValidation, loginOne)  //login with mobile
auth.post(basepath+'/login2',loginTwoValidation, loginTwo) //login with email and password

//-------- registration -------------
auth.post(basepath+'/registration',registrationValidation,registration)
auth.post(basepath+'/mobileotpverify',otpValidation,otpVerify)
auth.post(basepath+'/setpassword',setpasswordValidation,setPassword)

//-----------forgot password---------
auth.post(basepath+'/forgotpassword',forgotpassValidation,forgotpassword)
auth.post(basepath+'/forgototpverify',forgototpValidation,forgototpVerify)
auth.post(basepath+'/forgotsetpassword',forgotsetpassValidation,forgotsetPassword)

module.exports = auth

