const Admin = require("../../../../Models/AdminModel")
const bcrypt=require('bcrypt')

const jwt=require('jsonwebtoken')

const nodemailer=require('nodemailer')
const Faculty = require("../../../../Models/FacultyModel")
module.exports.adminRegister=async(req,res)=>{
    try{
            let checkEmail=await Admin.findOne({email:req.body.email})
            if(!checkEmail){
                if(req.body.password==req.body.confirmPassword){
                    req.body.password=await bcrypt.hash(req.body.password,10)
                        let AddAdmin=await Admin.create(req.body)
                        if(AddAdmin){
                            return res.status(200).json({'msg':'Admin register successfully',Record:AddAdmin})
                        }else{
                            return res.status(500).json({'msg':'Admin register failed'})
                        }
                    
                }else{
                    return res.status(200).json({'msg':'password and confirm password does not match'})
                }
            } else{
        return res.status(200).json({'msg':' email is alredy exist'})

            }
    }catch(err){
        return res.status(400).json({'msg':'somthing went wrong'})
    }
}

module.exports.adminLogin=async(req,res)=>{
    try{
        let checkEmail=await Admin.findOne({email:req.body.email})
        if(checkEmail){
            let  checkpass=await bcrypt.compare(req.body.password,checkEmail.password)
            if(checkpass){
                checkEmail=checkEmail.toObject();
                delete checkEmail.password;
                let Admintoken=await jwt.sign({AdminData:checkEmail},'RNW',{expiresIn:1000*60*60})
                if(Admintoken){
                    return res.status(200).json({'msg':'Admin login successfully',AdminToken:Admintoken})
                }else{
                    return res.status(500).json({'msg':'Admin login failed'})
                }
            }else{
                return res.status(200).json({'msg':'password is incorrect'})
            }
        }else{
            return res.status(200).json({'msg':'email is not exist'})
        }
    }catch(err){
        return res.status(400).json({'msg':'somthing went wrong'})
    }
}

module.exports.adminProfile=async(req,res)=>{
    try{
return res.status(200).json({'msg':'user Infomation',data:req.user})
    }catch(err){
        return res.status(400).json({'msg':'somthing went wrong'})
    }
}

module.exports.EditadminProfile=async(req,res)=>{
    try{
        console.log(req.params.id)
        let checkAdminId=await Admin.findById(req.params.id)
        if(checkAdminId){
            let updateAdmin=await Admin.findByIdAndUpdate(req.params.id,req.body)
            if(updateAdmin){
            let updateId=await Admin.findById(req.params.id)

                return res.status(200).json({'msg':'Admin profile updated successfully',data:updateId})
            }else{
                return res.status(200).json({'msg':'Admin profile not update'})
            }
        }else{
                return res.status(200).json({'msg':'Admin data not find'})

        }
    }catch(err){
        return res.status(400).json({'msg':'somthing went wrong'})
    }
}


module.exports.changePassword=async(req,res)=>{
    try{
        console.log(req.user)
        let currentPassCheck=await bcrypt.compare(req.body.currentPassword,req.user.password)
        if(currentPassCheck){
            if(req.body.currentPassword!=req.body.NewPassword){
                if(req.body.NewPassword==req.body.ConfirmPassword){
                    req.body.password=await bcrypt.hash(req.body.NewPassword,10)
                    let updatepassword=await Admin.findByIdAndUpdate(req.user._id,req.body)
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

module.exports.checkMail=async(req,res)=>{
    try{
        console.log(req.body)
        let checkEmail=await Admin.findOne({email:req.body.email})
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
    let checkEmail=await Admin.findOne({email:req.query.email})
    // console.log(checkEmail)
    if(checkEmail){
        if(req.body.NewPassword==req.body.ConfirmPassword){
            req.body.password=await bcrypt.hash(req.body.NewPassword,10)
            let updatepass=await Admin.findByIdAndUpdate(checkEmail._id,req.body)
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
// Faculty
module.exports.facultyRegister=async(req,res)=>{
    try{
        // console.log(req.body)
         let checkEmail=await Faculty.findOne({email:req.query.email})
         if(!checkEmail){
            let Gpass=generatePassword();
                // console.log(Gpass)
                var link='http://localhost:8002/api/';
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
                html: `<b><h1>your Login Details:</h1><p>Email:${req.body.email}</p><p>Password:${Gpass}</p><p>Login Click:${link}</p></b>`, // html body
                });

                if(info){
                    let encryptedPassword=await bcrypt.hash(Gpass,10)
                        let addFaculty=await Faculty.create({email:req.body.email,password:encryptedPassword,username:req.body.username})
                        if(addFaculty){
                            return res.status(200).json({'msg':'Faculty register successfully',data:addFaculty})
                        }
                        else{
                            return res.status(500).json({'msg':'Faculty register failed'})
                        }
                    return res.status(200).json({msg:"check Mail"})
                }else{
                    return res.status(500).json({'msg':'otp send failed'})
                }
            
                
         }else{
             return res.status(200).json({'msg':'email is alredy exist'})
         }

    }catch(err){
        return res.status(400).json({'msg':'somthing went wrong'})
    }
}

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}
module.exports.viewAllFaculty=async(req,res)=>{
    try{
        let findall=await Faculty.find()
        if(findall){
        return res.status(200).json({msg:"all faculty data",data:findall})

        }else{
        return res.status(200).json({msg:"not data "})

        }
    }
    catch(err){
        return res.status(400).json({msg:"somthing went wrong"})
    }
}

module.exports.viewAllStudent=async(req,res)=>{
    try{
        let findall=await Student.find()
        if(findall){
        return res.status(200).json({msg:"all faculty data",data:findall})

        }else{
        return res.status(200).json({msg:"not data "})

        }
    }
    catch(err){
        return res.status(400).json({msg:"somthing went wrong"})
    }
}


module.exports.statuschange=async(req,res)=>{
    try{
        let checkuser=await Admin.findById(req.query.userid);
        if(checkuser){
            if(req.query.userstatus == "true"){
                let checkstatus=await User.findByIdAndUpdate(req.query.userid,{status:false});
                if(checkstatus){
                    return res.status(200).json({'msg':"status dactive update",data:checkstatus});
                }
                else{
                    return res.status(400).json({'msg':"data not update",error:err});
                }
            }   
            else{
                if(req.query.userstatus){
                    let checkstatus=await Admin.findByIdAndUpdate(req.query.userid,{status:true});
                    if(checkstatus){
                        return res.status(200).json({'msg':"status active update",data:checkstatus});
                    }
                    else{
                        return res.status(400).json({'msg':"data not update",error:err});
                    }
                }
            }
        }
    }
    catch(err){
        return res.status(400).json({'msg':"something is wrong",error:err});
    }
}

module.exports.multipledelete = async (req, res) => {
    try {
        let deletedata=await Admin.deleteMany({_id:{$in:req.body.ids}});
        if(deletedata){
            return res.status(200).json({'msg':"data deleted successfully",data:deletedata});
        }
        else{
            return res.status(400).json({'msg':"data not delete",error:err});
        }
    } catch (err) {
        return res.status(400).json({ msg: "Something went wrong", error: err.message });
    }
};


module.exports.statuschangefaculty=async(req,res)=>{
    try{
        let checkuser=await Faculty.findById(req.query.userid);
        if(checkuser){
            if(req.query.status == "true"){
                let checkstatus=await Faculty.findByIdAndUpdate(req.query.userid,{status:false});
                if(checkstatus){
                    return res.status(200).json({'msg':"status dactive update",data:checkstatus});
                }
                else{
                    return res.status(400).json({'msg':"data not update",error:err});
                }
            }   
            else{
                if(req.query.status){
                    let checkstatus=await Faculty.findByIdAndUpdate(req.query.userid,{status:true});
                    if(checkstatus){
                        return res.status(200).json({'msg':"status active update",data:checkstatus});
                    }
                    else{
                        return res.status(400).json({'msg':"data not update",error:err});
                    }
                }
            }
        }
    }
    catch(err){
        return res.status(400).json({'msg':"something is wrong",error:err});
    }
}

