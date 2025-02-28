const express=require('express')

const routes=express.Router();
const passport=require('passport')

const facultyctl=require('../../../../Controllers/Api/V1/Faculty/facultiCtl')

routes.post('/facultyLogin',facultyctl.facultyLogin)

routes.get('/facultyProfile',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failerfaculty'}),facultyctl.facultyProfile)

routes.get('/failerfaculty',async(req,res)=>{
    try{
        return res.status(401).json({'msg':'invalid Token'})
    }catch(err){
        return res.status(400).json({msg:'login failed'})
    }
})


routes.put('/updateFacultyProfile/:id',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failerfaculty'}),facultyctl.updateFacultyProfile)

routes.post('/changeFacultyPassword',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failerfaculty'}),facultyctl.changeFacultyPassword)


routes.post('/checkMail',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failerfaculty'}),facultyctl.checkMail)


routes.post('/updatePassword',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failerfaculty'}),facultyctl.updatePassword)

routes.post('/logout',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failerfaculty'}),facultyctl.logout)

routes.post("/studentRegister",facultyctl.studentRegister)
routes.post('/multipledelete',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failerfaculty'}),facultyctl.multipledelete);


routes.get("/viewAllStudent",facultyctl.viewAllStudent)
routes.get('/statuschange',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failerfaculty'}),facultyctl.statuschange);


module.exports=routes;