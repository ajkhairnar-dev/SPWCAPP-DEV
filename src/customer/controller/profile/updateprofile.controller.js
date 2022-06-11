const updateProfile = async(req,res) => {
    try{
       const {customer_id, firstname, lastname, emailiid,dob} = req.body;
       await conn.query("update mst_customers set firstname=$1, lastname=$2, emailid=$3, dob=$4 where customer_id = $5",[firstname,lastname,emailiid,dob,customer_id]);
       return res.status(200).send({ success:true,message:"profile has been updated.",data:{} })
    }catch(error){
        return res.status(400).send({ success:false,message:ecode.profile.SYSC0201.desc, error_code:ecode.profile.SYSC0201, data:{ error:error } })
    }
}

module.exports = {
    updateProfile
}