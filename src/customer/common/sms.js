const smsconfig = require("../config/config.json").sms;
const msg91 = require("@walkover/msg91")(smsconfig.authkey, smsconfig.senderid, smsconfig.route);
const dlt = smsconfig.dlt;

const sentOTP = async (type,parameter) =>{

    try{
        console.log(parameter)
        const customer_id = parameter.customer_id;
        const mobileno = parameter.mobileno;
        let paramobj = _.omit(parameter,'customer_id','mobileno');
        console.log(paramobj)
        let dltcode;
        let message;
        switch (type) {
            case 0:
                    dltcode = dlt[type].dlt;
                    message = dlt[type].message;
                break;    
            default: 
                    return { success:false,message:"Something wents wrong.", error_code:ecode.sms.SYSC0301, data:{ error:error } }
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
                //db query
                console.log("error")
            }else{
                //success db query
                console.log("success")
            }
        });
    }catch(error){
        //db query
        console.log("error1")
    }
}

module.exports = {
    sentOTP
}