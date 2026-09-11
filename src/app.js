const express = require('express');
const app = express();
const bcrypt = require("bcrypt");
const path = require('path');
const userModel = require("./models/user")
const postModel = require("./models/post");
const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser")
const { hash } = require('crypto');
const cookieParser = require('cookie-parser');

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

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

app.get("/profile",isLogedIn,async (req,res)=>{
    let user = await userModel.findOne({email:req.user.email}).populate("posts")
    res.render("profile",{user:user})
})

app.get("/logout",(req,res)=>{
    res.cookie("token","")
    res.redirect("/login")
})

app.post("/post",isLogedIn,async (req,res)=>{
    let user = await userModel.findOne({email:req.user.email})
    let {content} = req.body
    let post = await postModel.create({
        user : user._id,
        content: content
    })
    user.posts.push(post._id)
    await user.save();
    res.redirect("/profile")
})

function isLogedIn(req,res,next){
    if(!req.cookies.token) {
        return res.send("You must be logged in")
    }
    let data = jwt.verify(req.cookies.token,"shhhh");
    req.user = data;
    next();
}


module.exports = app