const bcrypt = require('bcryptjs');
const moment = require('moment');
const {datetimediff} = require('../../common/datatimediff')
const {sentOTP } = require('../../common/sms')
const ecode = require("./error_code.json");

const registration = async(req,res) => {
    const { mobileno } = req.body;
    try{
        const {rows} = await conn.query("select * from mst_customers where mobileno=$1 and isverified=$2 ",[mobileno,1]);
        const otp = Math.floor(1000 + Math.random() * 9000);
        if(_.isEmpty(rows)){
            const {rows} = await conn.query("select * from mst_customers where mobileno=$1",[mobileno]);
            if(_.isEmpty(rows)){
                const {rows} =await conn.query("insert into mst_customers(mobileno,otp,otpdate,role_id,registrationby,isactive,isblock,isverified,createdate) values($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",[mobileno,otp,moment().format("YYYY-MM-DD hh:mm:ss"),2,'App',0,1,0,moment().format("YYYY-MM-DD hh:mm:ss")]);
                sentOTP(0,{"_otp_":otp,customer_id:rows[0].customer_id,mobileno:mobileno,role_id:2,otptype:1})
            }else{
                const {rows} = await conn.query("update mst_customers set otp=$1,otpdate=$2 where mobileno = $3 RETURNING *",[otp,moment().format("YYYY-MM-DD hh:mm:ss"),mobileno]);
                sentOTP(0,{"_otp_":otp,customer_id:rows[0].customer_id,mobileno:mobileno,role_id:2,otptype:1})
            }
            return res.status(200).send({ success:true,message:"OTP sent to your mobile number.", data:{ mobileno:mobileno } })
        }else{
            return res.status(400).send({ success:false,message:ecode.SYSC0104.msg,errorCode:ecode.SYSC0104.code, data:{} })
        }
    }catch(error) {
        console.log(error)
        return res.status(400).send({ success:false,message:ecode.SYSC0110.msg, errorCode:ecode.SYSC0110.code, data:{ error:error } }) 
    }
}

const otpVerify= async(req,res)=>{

    const { mobileno,otp } = req.body;
    try{
        const {rows} = await conn.query("select mobileno,otp,otpdate from mst_customers where mobileno=$1 and isverified=$2",[mobileno,0]);
        if(_.isEmpty(rows)){
            return res.status(400).send({ success:false,message:ecode.SYSC0108.msg,errorCode:ecode.SYSC0108.code, data:{} })
        }else{

            let otptime = moment(rows[0].otpdate).format("YYYY-MM-DD hh:mm:ss");
            let currenttime = moment().format("YYYY-MM-DD hh:mm:ss");
            const diff = await datetimediff(currenttime,otptime)
           
            if(diff.days > 0 || diff.hours > 0 || diff.minutes > 2){
                return res.status(400).send({ success:false,message:ecode.SYSC0106.msg,errorCode:ecode.SYSC0106.code, data:{} })
            }
           
            if(rows[0].otp == otp){
                const data = _.omit(rows[0],'otp','otpdate');
                return res.status(200).send({ success:true,message:"OTP verification successfully.",data:data })
            }else{
                return res.status(400).send({ success:false,message:ecode.SYSC0107.msg,errorCode:ecode.SYSC0107.code, data:{} })
            }
        }
    }catch(error){
        console.log(error)
        return res.status(400).send({ success:false,message:ecode.SYSC0110.msg, errorCode:ecode.SYSC0110.code, data:{ error:error } })
    }
}

const setPassword = async(req,res)=>{
    try{
        const{mobileno,password} = req.body;
        const {rows} = await conn.query("select customer_id,mobileno,otpdate from mst_customers where mobileno=$1 and isverified=$2",[mobileno,0]);
        if(_.isEmpty(rows)){
            return res.status(400).send({ success:false,message:ecode.SYSC0109.msg,errorCode:ecode.SYSC0109.code, data:{} })
        }else{
            
        let otptime = moment(rows[0].otpdate).format("YYYY-MM-DD hh:mm:ss");
        let currenttime = moment().format("YYYY-MM-DD hh:mm:ss");
        const diff = await datetimediff(currenttime,otptime)
        
        if(diff.days > 0 || diff.hours > 0 || diff.minutes > 2){
            return res.status(400).send({ success:false,message:ecode.SYSC0106.msg,errorCode:ecode.SYSC0106.code, data:{} })
        }

        const hashPassword = await bcrypt.hash(password,10);
        await conn.query("update mst_customers set password=$1, isactive=$2, isblock=$3, isverified=$4 where customer_id=$5",[hashPassword,1,0,1,rows[0].customer_id]);
        return res.status(200).send({ success:true,message:"Password has been set. Please login.",data:{} })
        }
    }catch(error){
        return res.status(400).send({ success:false,message:ecode.SYSC0110.msg, errorCode:ecode.SYSC0110.code, data:{ error:error } })
    }
}


module.exports = {
    registration,
    otpVerify,
    setPassword
}