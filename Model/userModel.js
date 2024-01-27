import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const {Schema, model} = mongoose

const userSchema = new Schema({
    fullname : {
        type : String,
        trim : true,
        required : true
    },
    username : {
        type : String,
        trim : true,
        unique : true,
        required : true
    },
    email : {
        type : String,
        trim : true,
        unique : true,
        required : true
    },
    phone : {
        type : String,
        unique : true,
        // trim : true,
        required : true
    },
    address : {
        type : String,
        trim : true,
        required : true
    },
    verified : {
        type : Boolean,
        enum : [true, false],
        default : false
    }, 
    role : {
        type : String,
        enum : ['user', "admin"],
        default : "user",
        required : true
    },
    password : {
        type : String,
        trim : true,
        required : true,
        select : false
    },
    passwordResetToken : {
        type : String,
        unique : true
    },
    expiredAt : {
        type : Date
    },
    
},  {timestamps : true})


// {{{{{{{{{{{{{{{{{{{{{{Mongodb middleware}}}}}}}}}}}}}}}}}}}}}}
userSchema.pre("save", async function(next){
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

export const USER_DB = model("test", userSchema)