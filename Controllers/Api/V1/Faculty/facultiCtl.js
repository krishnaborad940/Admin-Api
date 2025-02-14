const Faculty = require("../../../../Models/FacultyModel")
const bcrypt = require("bcrypt")
const jwt=require('jsonwebtoken')
module.exports.facultyLogin=async(req,res)=>{
    try{
        // console.log(req.body)
        let checkFacultyEmail=await Faculty.findOne({email:req.body.email})
        if(checkFacultyEmail){
            let checkpass=await bcrypt.compare(req.body.password,checkFacultyEmail.password)
            if(checkpass){
                checkFacultyEmail=checkFacultyEmail.toObject();
                delete checkFacultyEmail.password
                let facultyToken=await jwt.sign({ft:checkFacultyEmail},'FRNW',{expiresIn:'1h'})
                if(facultyToken){
                    return res.status(200).json({msg:'Faculty login successfully',facultyToken:facultyToken})
                }else{
                    return res.status(500).json({msg:'Token Error'})
                }
            }else{
                return res.status(401).json({msg:'Invalid Password'})
            }
        }else{
            return res.status(200).json({msg:"Email is Already Exist"})
        }

    }catch(err){
        return res.status(400).json({msg:'somthing went wrong'})
    }
}

module.exports.facultyProfile=async(req,res)=>{
    try{
// console.log(req.user)
    return res.status(200).json({'msg':'Faculty Data',Facultydata:req.user})

    }catch(err){
    return res.status(400).json({'msg':'somthnig went wrong'})
    }
}

module.exports.updateFacultyProfile=async(req,res)=>{
    try{
// console.log(req.params.id)
// console.log(req.body)

let checkEmail=await Faculty.findById(req.params.id)
if(checkEmail){
    let updateFaculty=await Faculty.findByIdAndUpdate(req.params.id,req.body)
    if(updateFaculty){
let changedata=await Faculty.findById(req.params.id)
    return res.status(200).json({'msg':'Id is not found',data:changedata})

    }
}else{
    return res.status(200).json({'msg':'Id is not found'})

}

    }catch(err){
    return res.status(400).json({'msg':'somthnig went wrong'})
    }
}


module.exports.changeFacultyPassword=async(req,res)=>{
    try{
        console.log(req.user)
        let currentPassCheck=await bcrypt.compare(req.body.currentPassword,req.user.password)
        if(currentPassCheck){
            if(req.body.currentPassword!=req.body.NewPassword){
                if(req.body.NewPassword==req.body.ConfirmPassword){
                    req.body.password=await bcrypt.hash(req.body.NewPassword,10)
                    let updatepassword=await Faculty.findByIdAndUpdate(req.user._id,req.body)
                    if(updatepassword){
                        return res.status(200).json({'msg':'password updated successfully',data:updatepassword})
                    }else{
                        return res.status(200).json({'msg':'password is not update '})

                    }
                }else{
                    return res.status(200).json({'msg':'New password and confirm password should not be same'})
                }
            }else{
                return res.status(200).json({'msg':'New password and current password are match'})
            }
        }else{
            return res.status(200).json({'msg':'Current password is incorrect'})
        }
    }catch(err){
        return res.status(400).json({'msg':'somthing went wrong'})

    }
}

module.exports.checkMail=async(req,res)=>{
    try{
        console.log(req.body)
        let checkEmail=await Faculty.findOne({email:req.body.email})
        if(checkEmail){
            const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: "boradkrishna940@gmail.com",
                pass: "aqktjqosavlnsdly",
            },
            tls:{
                rejectUnauthorized:false
            }
            });
            let otp=Math.floor(Math.random()*100000)
             const info = await transporter.sendMail({
                from: 'boradkrishna940@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: `<b>Hello world ${otp}</b>`, // html body
                });
                // console.log("send mail")
                let data={
                    email:req.body,otp
                }
                if(info){
                    return res.status(200).json({'msg':'otp send successfully',data:data})
                }else{
                    return res.status(500).json({'msg':'otp send failed'})
                }
        }else{
            return res.status(200).json({'msg':'email is not exist'})
        }

    }catch(err){
        return res.status(400).json({'msg':'somthing went wrong'})
    }
}

module.exports.updatePassword=async(req,res)=>{
    try{
        // console.log(req.query)
        // console.log(req.body)
    let checkEmail=await Faculty.findOne({email:req.query.email})
    // console.log(checkEmail)
    if(checkEmail){
        if(req.body.NewPassword==req.body.ConfirmPassword){
            req.body.password=await bcrypt.hash(req.body.NewPassword,10)
            let updatepass=await Faculty.findByIdAndUpdate(checkEmail._id,req.body)
            if(updatepass){

                return res.status(200).json({'msg':'password updated successfully',data:updatepass})
            }else{
                return res.status(200).json({'msg':'password is not update'})
            }
        }else{
        return res.status(200).json({'msg':'NewPassword And ConfirmPassword is not match'})

        }
    }else{
        return res.status(200).json({'msg':'email is not exist'})
    }
    }catch(err){
        return res.status(400).json({'msg':'somthing went wrong'})

    }
}

module.exports.logout=async(req,res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                return res.status(400).json({'msg':'logout failed'})
            }else{
                return res.status(200).json({'msg':'logout successfully'})
            }
        })
    }
    catch (err){
        return res.status(400).json({'msg':'somthing went wrong'})
    }
}