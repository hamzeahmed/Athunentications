require('dotenv').config();
const express = require('express');
const _ = require('lodash');
const encyrpt  = require("mongoose-encryption");
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}));
const mongoose = require('mongoose');
const conn = "mongodb+srv://admin-hamze:hamze1122@cluster0.r5u1n.mongodb.net"
mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false
 });


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(encyrpt,{secret: process.env.SECRET, encryptedFields:['password'] });
const User = mongoose.model("User", userSchema);
app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register", (req,res)=>{
    const newUser = new User({
       email: req.body.username,
       password: req.body.password 
    });
    newUser.save((err)=>{
        if(!err){
            res.render("secrets");
        }else{
            console.log(err)
        }
        //password
    });
});

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username},(err,foundUser)=>{
        if(!err){
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }else{
                console.log("Not Found")
            }
        }else{
            console.log(err);
        }
    });
});

let port = process.env.PORT;
if(port == null ||  port == ""){
    port = 3000;
}
app.listen(port, ()=>{
    console.log('Listining Posrt 3000! ');
}) 