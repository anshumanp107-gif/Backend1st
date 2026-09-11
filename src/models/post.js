const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    content : String,
})

const postModel = mongoose.model("post",postSchema)

module.exports = postModel