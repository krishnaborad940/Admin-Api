const express=require('express')

const port=8002;

const app=express();
// const db=require('./config/db')
const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://boradkrishna940:ZYQJTHTvp81MCI9X@first.7vdki.mongodb.net/schoolMngt').then((res)=>console.log("db is connected"))
.catch((err)=>console.log(err))
app.use(express.urlencoded())

app.use('/api',require('./Routes/Api/V1/Admin'))

app.listen(port,(err)=>{
    if(err){
        console.log(err)
        return false;
    }
    console.log("port is-",port)
})