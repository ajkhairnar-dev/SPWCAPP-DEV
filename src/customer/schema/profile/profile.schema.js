const Joi = require('joi');

const profileSchema = {
    changepassword :Joi.object({
        password: Joi.string().min(3).max(15).required(),
        confirmpass: Joi.string().required().valid(Joi.ref('password')),
        token:Joi.string().min(4).message('provide token').required()
    })
}



module.exports = profileSchema;
