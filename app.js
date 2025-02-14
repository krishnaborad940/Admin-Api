const express=require('express')

const port=8002;

const app=express();
// const db=require('./config/db')
const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://boradkrishna940:ZYQJTHTvp81MCI9X@first.7vdki.mongodb.net/schoolMngt').then((res)=>console.log("db is connected"))
.catch((err)=>console.log(err))

const passport=require('passport');
const jwtStratergy=require('./config/passpoert-stratergy')
const session=require('express-session')

app.use(express.urlencoded())

app.use(session({
    name:'ApiProject',
    secret:'SchoolApi',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60
    }
}))

app.use(passport.initialize())
app.use(passport.session())



app.use('/api',require('./Routes/Api/V1/Admin'))
app.use('/api/faculty',require('./Routes/Api/V1/Faculty Routes'))


app.listen(port,(err)=>{
    if(err){
        console.log(err)
        return false;
    }
    console.log("port is-",port)
})