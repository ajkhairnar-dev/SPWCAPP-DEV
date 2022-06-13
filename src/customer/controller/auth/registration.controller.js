const bcrypt = require('bcryptjs');
const moment = require('moment');
const {datetimediff} = require('../../common/datatimediff')
const {sentOTP } = require('../../common/sms')

const registration = async(req,res) => {
    const { mobileno } = req.body;
    try{
        const {rows} = await conn.query("select * from mst_customers where mobileno=$1 and isverified=$2",[mobileno,1]);
        const otp = Math.floor(1000 + Math.random() * 9000);
        if(_.isEmpty(rows)){
            const {rows} = await conn.query("select * from mst_customers where mobileno=$1",[mobileno]);
            if(_.isEmpty(rows)){
                const {rows} =await conn.query("insert into mst_customers(mobileno,otp,otpdate,role_id,registrationby,isverified,createdate) values($1,$2,$3,$4,$5,$6,$7) RETURNING *",[mobileno,otp,moment().format("YYYY-MM-DD hh:mm:ss"),2,'App',0,moment().format("YYYY-MM-DD hh:mm:ss")]);
                sentOTP(0,{"_otp_":otp,customer_id:rows[0].customer_id,mobileno:mobileno,role_id:2,otptype:1})
            }else{
                const {rows} = await conn.query("update mst_customers set otp=$1,otpdate=$2 where mobileno = $3 RETURNING *",[otp,moment().format("YYYY-MM-DD hh:mm:ss"),mobileno]);
                sentOTP(0,{"_otp_":otp,customer_id:rows[0].customer_id,mobileno:mobileno,role_id:2,otptype:1})
            }
            return res.status(200).send({ success:true,message:"OTP sent to your mobile number.", data:{ mobileno:mobileno } })
        }else{
            return res.status(400).send({ success:false,message:ecode.auth.SYSC0104.msg,error_code:ecode.auth.SYSC0104, data:{} })
        }
    }catch(error) {
       
        return res.status(400).send({ success:false,message:ecode.auth.SYSC0110.msg, error_code:ecode.auth.SYSC0110, data:{ error:error } }) 
    }
}

const otpVerify= async(req,res)=>{
    const { mobileno,otp } = req.body;
    try{
        const {rows} = await conn.query("select mobileno,otp,otpdate from mst_customers where mobileno=$1 and isverified=$2",[mobileno,0]);
        if(_.isEmpty(rows)){
            return res.status(400).send({ success:false,message:ecode.auth.SYSC0108.msg,error_code:ecode.auth.SYSC0108, data:{} })
        }else{

            let otptime = moment(rows[0].otpdate).format("YYYY-MM-DD hh:mm:ss");
            let currenttime = moment().format("YYYY-MM-DD hh:mm:ss");
            const diff = await datetimediff(currenttime,otptime)
           
            if(diff.days > 0 || diff.hours > 0 || diff.minutes > 2){
                return res.status(400).send({ success:false,message:ecode.auth.SYSC0106.msg,error_code:ecode.auth.SYSC0106, data:{} })
            }
           
            if(rows[0].otp == otp){
                const data = _.omit(rows[0],'otp','otpdate');
                return res.status(200).send({ success:true,message:"OTP verification successfully.",data:data })
            }else{
                return res.status(400).send({ success:false,message:ecode.auth.SYSC0107.msg,error_code:ecode.auth.SYSC0107, data:{} })
            }
        }
    }catch(error){
        console.log(error)
        return res.status(400).send({ success:false,message:ecode.auth.SYSC0110.msg, error_code:ecode.auth.SYSC0110, data:{ error:error } })
    }
}

const setPassword = async(req,res)=>{
    try{
        const{mobileno,password} = req.body;
        const {rows} = await conn.query("select customer_id,mobileno,otpdate from mst_customers where mobileno=$1 and isverified=$2",[mobileno,0]);
        if(_.isEmpty(rows)){
            return res.status(400).send({ success:false,message:ecode.auth.SYSC0109.msg,error_code:ecode.auth.SYSC0109, data:{} })
        }else{
            
        let otptime = moment(rows[0].otpdate).format("YYYY-MM-DD hh:mm:ss");
        let currenttime = moment().format("YYYY-MM-DD hh:mm:ss");
        const diff = await datetimediff(currenttime,otptime)
        
        if(diff.days > 0 || diff.hours > 0 || diff.minutes > 2){
            return res.status(400).send({ success:false,message:ecode.auth.SYSC0106.msg,error_code:ecode.auth.SYSC0106, data:{} })
        }

        const hashPassword = await bcrypt.hash(password,10);
        await conn.query("update mst_customers set password=$1, isverified=$2 where customer_id = $3",[hashPassword,1,rows[0].customer_id]);
        return res.status(200).send({ success:true,message:"Password has been set. Please login.",data:{} })
        }
    }catch(error){
        return res.status(400).send({ success:false,message:ecode.auth.SYSC0110.msg, error_code:ecode.auth.SYSC0110, data:{ error:error } })
    }
}


module.exports = {
    registration,
    otpVerify,
    setPassword
}