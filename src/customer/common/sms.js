
const moment = require('moment');
const smsconfig = require("../config/config.json").sms;
const msg91 = require("@walkover/msg91")(smsconfig.authkey, smsconfig.senderid, smsconfig.route);
const dlt = smsconfig.dlt;

const sentOTP = async(type,parameter) =>{
    try{
        let customer_id = parameter.customer_id;
        let mobileno=parameter.mobileno;
        let otp;
        let paramobj;
        let dltcode;
        let message;
        let otptype_id=parameter.otptype;
        let isdetails;
        let role_id=parameter.role_id;
        switch (type) {
            case 0:
                    otp = parameter._otp_;
                    paramobj = _.omit(parameter,'customer_id','mobileno','otptype','role_id');

                    dltcode = dlt[type].dlt;
                    message = dlt[type].message;
                break;    
            default: 
                    return { success:false,message:ecode.sms.SYSC0301.msg, error_code:ecode.sms.SYSC0301, data:{ error:error } }
                break;
        }

        //replace all parameter from message
        var RE = new RegExp(Object.keys(paramobj).join("|"), "gi");
        var finalmsg = message.replace(RE, function(matched) {
            return paramobj[matched];
        });

        //load msg library
        msg91.send("91"+mobileno, finalmsg, dltcode, function(error, response){
            if(error){
                //error
                isdetails = JSON.stringify(error)
                conn.query("insert into otpdetails(customer_id,role_id,otptype_id,issuccess,message,createdate) values($1,$2,$3,$4,$5,$6) RETURNING *",
                [customer_id,role_id,otptype_id,"error",finalmsg,moment().format("YYYY-MM-DD hh:mm:ss")]);
            }else{
                //success
                isdetails = "otp sent successfully";
                conn.query("insert into otpdetails(customer_id,role_id,otptype_id,issuccess,message,createdate) values($1,$2,$3,$4,$5,$6) RETURNING *",
                [customer_id,role_id,otptype_id,"success",finalmsg,moment().format("YYYY-MM-DD hh:mm:ss")]);
            }
        });
    }catch(error){
        //db query
        console.log(error)
    }
}

module.exports = {
    sentOTP
}