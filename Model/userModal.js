const mongoose = require("mongoose") ;

const userSchema =new  mongoose.Schema({
    userName : {type : String, required : true },
    password : {type : String, required : true }
})

const userModal = mongoose.model("chessUser",userSchema)  ;
module.exports = userModal ;