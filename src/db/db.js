const mongoose = require("mongoose")

async function connectDB(){
    mongoose.connect("mongodb://localhost:27017/pluto")
    console.log("Connected to DataBase")
}

module.exports = connectDB;