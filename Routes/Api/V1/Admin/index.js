const express=require('express');

const routes=express.Router()

const adminCtl=require('../../../../Controllers/Api/V1/Admin/adminCtl');
const passport = require('passport');


routes.post('/adminRegister',adminCtl.adminRegister)
routes.post('/adminLogin',adminCtl.adminLogin)

routes.get('/adminProfile',passport.authenticate('jwt',{failureRedirect:'/api/adminFailerLogin'}),adminCtl.adminProfile)

routes.put('/EditadminProfile/:id',passport.authenticate('jwt',{failureRedirect:'/api/adminFailerLogin'}),adminCtl.EditadminProfile)

routes.post('/changePassword',passport.authenticate('jwt',{failureRedirect:'/api/adminFailerLogin'}),adminCtl.changePassword)

routes.get('/logout',passport.authenticate('jwt',{failureRedirect:'/api/adminFailerLogin'}),adminCtl.logout)

routes.get('/adminFailerLogin',async(req,res)=>{
    try{
        return res.status(401).json({'msg':'invalid Token'})
    }catch(err){
        return res.status(400).json({msg:'login failed'})
    }
})


routes.post('/checkMail',adminCtl.checkMail)

routes.post('/updatePassword',adminCtl.updatePassword)

routes.post('/facultyRegister',adminCtl.facultyRegister)

routes.get('/viewAllFaculty',adminCtl.viewAllFaculty)
routes.get('/viewAllStudent',adminCtl.viewAllStudent)


routes.post('/multipledelete',passport.authenticate('jwt',{failureRedirect:'/api/adminFailerLogin'}),adminCtl.multipledelete);

routes.get('/statuschangefaculty',passport.authenticate('jwt',{failureRedirect:'/api/adminFailerLogin'}),adminCtl.statuschangefaculty);

routes.get('/statuschange',passport.authenticate('jwt',{failureRedirect:'/api/adminFailerLogin'}),adminCtl.statuschange);




// console.log("connected")
module.exports=routes;