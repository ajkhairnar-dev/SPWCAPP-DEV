const { changepassword } = require('./profile.schema');

const chagepassValidation = async (req,res,next) => {
    const value= await changepassword.validate(req.body);
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


module.exports={
    chagepassValidation
}