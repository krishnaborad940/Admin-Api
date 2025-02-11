const express=require('express');

const routes=express.Router()

const adminCtl=require('../../../../Controllers/Api/V1/Admin/adminCtl')


routes.post('/adminRegister',adminCtl.adminRegister)
routes.post('/adminLogin',adminCtl.adminLogin)

// console.log("connected")
module.exports=routes;