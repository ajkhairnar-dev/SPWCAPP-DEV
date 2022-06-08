
const { registration,otpvalidate,setpassword } = require('./registration.schema')

const registrationValidation = async (req,res,next) => {
    const value= await registration.validate(req.body);
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

const otpValidation = async(req,res,next) => {
    const value= await otpvalidate.validate(req.body);
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

const setpasswordValidation = async(req,res,next) => {
   
    const value= await setpassword.validate(req.body);
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
    registrationValidation,
    otpValidation,
    setpasswordValidation
}
