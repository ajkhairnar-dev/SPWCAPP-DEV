const Joi = require('joi');

const registrationSchema = {

    registration :Joi.object({
        mobileno:Joi.string().regex(/^[0-9]{10}$/).message('Mobile no. must be 10 digit.').required()
    }),
    otpvalidate : Joi.object({
        mobileno:Joi.string().regex(/^[0-9]{10}$/).message('Mobile no. must be 10 digit.').required(),
        otp:Joi.string().min(4).message('OTP must be 4 digit.').max(4).message('OTP must be 4 digit.').required()
    }),
    setpassword :Joi.object({
        mobileno:Joi.string().regex(/^[0-9]{10}$/).message('Mobile no. must be 10 digit.').required(),
        password:Joi.string().min(6).message('Password at least 6 to 12 character.').max(12).message('Password at least 6 to 12 character.').required()
    })
}

module.exports = registrationSchema