const bcrypt = require('bcryptjs');
const ecode = require("./error_code.json");

const changePassword = async(req,res) => {
    try{
       const {customer_id,password} = req.body;
       const hashPassword = await bcrypt.hash(password,10);
       await conn.query("update mst_customers set password=$1 where customer_id = $2",[hashPassword,customer_id]);
       return res.status(200).send({ success:true,message:"password has been changed.",data:{} })
    }catch(error){
        return res.status(400).send({ success:false,message:ecode.SYSC0201.msg, errorCode:ecode.SYSC0201.code, data:{ error:error } })
    }
}

module.exports = {
    changePassword
}