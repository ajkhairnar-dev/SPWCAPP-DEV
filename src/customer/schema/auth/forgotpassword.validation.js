const { forgotpassword,forgototpvalidate,forgotsetpassword } = require('./forgotpassword.schema')

const forgotpassValidation = async (req,res,next) => {
    const value= await forgotpassword.validate(req.body);
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

const forgototpValidation = async(req,res,next) => {
    const value= await forgototpvalidate.validate(req.body);
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

const forgotsetpassValidation = async(req,res,next) => {
   
    const value= await forgotsetpassword.validate(req.body);
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
    forgotpassValidation,
    forgototpValidation,
    forgotsetpassValidation
}
