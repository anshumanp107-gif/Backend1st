const express = require('express');
const app = express();
const bcrypt = require("bcrypt");
const path = require('path');
const userModel = require("./models/user")
const postModel = require("./models/post");
const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser")
const { hash } = require('crypto');

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.render("index")
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",async (req,res)=>{
    let {email,password} = req.body
    let user = await userModel.findOne({email})
    if(!user) res.send("Something went wrong")
    bcrypt.compare(password,user.password,(err,result)=>{
        if(result) {
            let token = jwt.sign({email:email},'shhhh');
            res.cookie("token",token)
            res.redirect("/profile")
        }
        else res.redirect("/login")
    })
})

app.get("/signUp",(req,res)=>{
    res.render("signUp")
})

app.post("/signUp",async (req,res)=>{
    let {name,email,gender,password} = req.body;
    let isUserExist = await userModel.findOne({email})
    if(isUserExist) return res.send("User has been created by this emailId");
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,(err,hash)=>{
            userModel.create({
                name:name,
                email:email,
                gender:gender,
                password:hash
            })
            let token = jwt.sign({email:email},'shhhh');
            res.cookie("token",token)
            res.redirect("/profile")
        })
    })
})

app.get("/profile",(req,res)=>{
    res.render("profile")
})

app.get("/logout",(req,res)=>{
    res.cookie("token","")
    res.redirect("/login")
})

module.exports = app