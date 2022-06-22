const moment = require('moment');
const ecode = require("./error_code.json");

const updateProfile = async(req,res) => {
    try{
       const {customer_id, firstname, lastname, emailid,dob} = req.body;
       await conn.query("update mst_customers set firstname=$1, lastname=$2, emailid=$3, dob=$4, updatedate=$5 where customer_id = $6",[firstname,lastname,emailid,dob,moment().format("YYYY-MM-DD hh:mm:ss"),customer_id]);
       return res.status(200).send({ success:true,message:"Profile has been updated.",data:{} })
    }catch(error){
        return res.status(400).send({ success:false,message:ecode.SYSC0201.msg, errorCode:ecode.SYSC0201.code, data:{ error:error } })
    }
}

module.exports = {
    updateProfile
}