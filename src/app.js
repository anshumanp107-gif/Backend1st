const express = require('express')
const app = express()
const path = require('path');

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

app.get("/signUp",(req,res)=>{
    res.render("signUp")
})

app.get("/profile",(req,res)=>{
    res.render("profile")
})

module.exports = app