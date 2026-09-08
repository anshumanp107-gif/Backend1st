const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userName : "String",
    gender : "String",
    email : "String",
    password : "String",
    postid : "String"
})

const userModel = mongoose.model("user",userSchema)

module.exports(userModel)