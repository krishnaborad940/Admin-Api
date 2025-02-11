const Admin = require("../../../../Models/AdminModel")
const bcrypt=require('bcrypt')

const jwt=require('jsonwebtoken')
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
                let Admintoken=await jwt.sign({AdminData:checkEmail},'RNW',{expiresIn:1000*60*60})
                if(Admintoken){
                      req.body.password=await bcrypt.hash(req.body.password,secret,10)
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