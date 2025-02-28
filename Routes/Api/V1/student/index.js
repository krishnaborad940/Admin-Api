const express=require('express')

const routes=express.Router();
const passport=require('passport')

const studentCtl=require('../../../../Controllers/Api/V1/student/studentCtl')

routes.post('/studentLogin',studentCtl.studentLogin)

routes.get('/studentProfile',passport.authenticate('student',{failureRedirect:'/api/student/failerStudent'}),studentCtl.studentProfile)

routes.get('/failerStudent',async(req,res)=>{
    try{
        return res.status(401).json({'msg':'invalid Token'})
    }catch(err){
        return res.status(400).json({msg:'login failed'})
    }
})


routes.put('/updateStudentProfile/:id',passport.authenticate('student',{failureRedirect:'/api/student/failerStudent'}),studentCtl.updateStudentProfile)

routes.post('/changeStudentPassword',passport.authenticate('student',{failureRedirect:'/api/student/failerStudent'}),studentCtl.changeStudentPassword)


routes.post('/checkMail',passport.authenticate('student',{failureRedirect:'/api/student/failerStudent'}),studentCtl.checkMail)


routes.post('/updatePassword',passport.authenticate('student',{failureRedirect:'/api/student/failerStudent'}),studentCtl.updatePassword)

routes.post('/logout',passport.authenticate('student',{failureRedirect:'/api/student/failerStudent'}),studentCtl.logout)

routes.post('/multipledelete',passport.authenticate('student',{failureRedirect:'/api/student/failerStudent'}),studentCtl.multipledelete);


module.exports=routes;