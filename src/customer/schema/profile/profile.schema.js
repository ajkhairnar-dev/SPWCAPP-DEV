const Joi = require('joi');

const profileSchema = {
    changepassword :Joi.object({
        customer_id:Joi.number().min(1).message("custome id is required.").required(),
        password: Joi.string().min(3).max(15).required(),
        confirmpass: Joi.any().equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' })
    })
}



module.exports = profileSchema;
