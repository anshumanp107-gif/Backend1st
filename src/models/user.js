const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name : String,
    gender : String,
    email : String,
    password : String,
    posts : [{type: mongoose.Schema.Types.ObjectId, ref:"post"}]
})

const userModel = mongoose.model("user",userSchema)

module.exports = userModel