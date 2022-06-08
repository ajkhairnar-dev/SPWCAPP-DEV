const { login1,login2 } = require('./login.schema')

const loginOneValidation = async (req,res,next) => {
    const value= await login1.validate(req.body);
    if(value.error){
        res.status(400).send({
            success: false,
            message:value.error.details[0].message,
            data:{}
        })
    }else{
        next();
    }
}

const loginTwoValidation = async (req,res,next) => {
    const value= await login2.validate(req.body);
    if(value.error){
        res.status(400).send({
            success: false,
            message:value.error.details[0].message,
            data:{}
        })
    }else{
        next();
    }
}


module.exports = {
    loginOneValidation,
    loginTwoValidation
}
