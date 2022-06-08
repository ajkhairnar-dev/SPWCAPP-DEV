const bcrypt = require('bcryptjs');
const moment = require('moment');
const {datetimediff} = require('../../common/datatimediff')


const registration = async(req,res) => {
    const { mobileno } = req.body;
    try{
        const {rows} = await conn.query("select * from customer where mobileno=$1 and isverified=1",[mobileno]);
        
        if(_.isEmpty(rows)){
            const {rows} = await conn.query("select * from customer where mobileno=$1",[mobileno]);
            if(_.isEmpty(rows)){
                //otp generate method
                const otp = 3435;
                await conn.query("insert into customer(mobileno,otp,otpdate,registrationby) values($1,$2,$3,$4)",[mobileno,otp,moment().format("YYYY-MM-DD hh:mm:ss"),'App']);
            }else{
                //otp generate method
                const otp = 1111;
                await conn.query("update customer set otp=$1,otpdate=$2 where mobileno = $3",[otp,moment().format("YYYY-MM-DD hh:mm:ss"),mobileno]);
            }
            return res.status(200).send({ success:true,message:"OTP sent to your mobile number.", data:{ mobileno:mobileno } })
        }else{
            return res.status(400).send({ success:false,message:"Mobile number already registered.",error_code:ecode.auth.SYSC0104, data:{} })
        }
    }catch (error) {
        return res.status(400).send({ success:false,message:"Something wents wrong.", error_code:ecode.auth.SYSC0110, data:{ error:error } }) 
    }
}

const otpVerify= async(req,res)=>{
    const { mobileno,otp } = req.body;
    try{
        const {rows} = await conn.query("select mobileno,otp,otpdate from customer where mobileno=$1 and isverified=0",[mobileno]);
        if(_.isEmpty(rows)){
            return res.status(400).send({ success:false,message:"Error occurs in otp verification.",error_code:ecode.auth.SYSC0108, data:{} })
        }else{

            let otptime = moment(rows[0].otpdate).format("YYYY-MM-DD hh:mm:ss");
            let currenttime = moment().format("YYYY-MM-DD hh:mm:ss");
            const diff = await datetimediff(currenttime,otptime)
           
            if(diff.days > 0 || diff.hours > 0 || diff.minutes > 2){
                return res.status(400).send({ success:false,message:"Session is expired.Resend OTP.",error_code:ecode.auth.SYSC0106, data:{} })
            }
           
            if(rows[0].otp == otp){
                const data = _.omit(rows[0],'otp','otpdate');
                return res.status(200).send({ success:true,message:"OTP verification successfully.",data:data })
            }else{
                return res.status(400).send({ success:false,message:"Enter valid OTP.",error_code:ecode.auth.SYSC0107, data:{} })
            }
        }
    }catch(error){
        return res.status(400).send({ success:false,message:"Something wents wrong.", error_code:ecode.auth.SYSC0110, data:{ error:error } })
    }
}

const setPassword = async(req,res)=>{
    try{
        const{mobileno,password} = req.body;
        const {rows} = await conn.query("select customer_id,mobileno,otpdate from customer where mobileno=$1 and isverified=0",[mobileno]);
        if(_.isEmpty(rows)){
            return res.status(400).send({ success:false,message:"Error occurs in setpassword.",error_code:ecode.auth.SYSC0109, data:{} })
        }else{
            
        let otptime = moment(rows[0].otpdate).format("YYYY-MM-DD hh:mm:ss");
        let currenttime = moment().format("YYYY-MM-DD hh:mm:ss");
        const diff = await datetimediff(currenttime,otptime)
        
        if(diff.days > 0 || diff.hours > 0 || diff.minutes > 2){
            return res.status(400).send({ success:false,message:"Session is expire.Resend OTP",error_code:ecode.auth.SYSC0106, data:{} })
        }

        const hashPassword = await bcrypt.hash(password,10);
        await conn.query("update customer set password=$1, isverified=1 where customer_id = $2",[hashPassword,rows[0].customer_id]);
        return res.status(200).send({ success:true,message:"Password has been set. Please login.",data:{} })
        }
    }catch(error){
        return res.status(400).send({ success:false,message:"Something wents wrong.", error_code:ecode.auth.SYSC0110, data:{ error:error } })
    }
}


module.exports = {
    registration,
    otpVerify,
    setPassword
}