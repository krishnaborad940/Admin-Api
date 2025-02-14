const passport = require('passport')

const Admin = require('../Models/AdminModel')

const jwtStratergy=require('passport-jwt').Strategy

const ExtractJwt=require('passport-jwt').ExtractJwt

const opts={
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:'RNW'
}

passport.use(new jwtStratergy(opts,async(payload,done)=>{
    let checkEmail=await Admin.findOne({email:payload.AdminData.email}) 
    if(checkEmail){
        return done(null,checkEmail)
    }else{
        return done(null,false)
    }
}))


// faculty
const Faculty = require('../Models/FacultyModel')

const facultyOpts={
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:'FRNW'
}

passport.use('faculty',new jwtStratergy(facultyOpts,async(payload,done)=>{
    let checkfacultyEmail=await Faculty.findOne({email:payload.ft.email}) 
    if(checkfacultyEmail){
        return done(null,checkfacultyEmail)
    }else{
        return done(null,false)
    }
}))



passport.serializeUser((user,done)=>{
    return done(null,user.id)
})

passport.deserializeUser(async(id,done)=>{
    let checkId=await Admin.findById(id);
    if(checkId){
        return done(null,checkId)
    }
    else{
        return done(null,false)
    }
})

module.exports=passport