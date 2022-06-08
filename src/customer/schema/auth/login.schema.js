const Joi = require('joi');

const login = {

    login1 : Joi.object({
        mobileno: Joi.string().regex(/^[0-9]{10}$/).message('Invalid mobile number.').required()
    }),

    login2 : Joi.object({
        mobileno:Joi.string().regex(/^[0-9]{10}$/).message('Invalid mobile number.').required(),
        password :Joi.string().min(6).required(),
    })
}

module.exports = login;
