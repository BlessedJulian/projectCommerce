import mongoose from "mongoose";


const {Schema, model} = mongoose

const validateUserSchema = new Schema({
    email :{
        type : String,
        required : true,
        unique   : true
    }, 
    otp : {
        type : String,
        required : true,
        unique : true
    },
    createdAt : {
       type :   Date,
       default: Date.now
    },
    expiredAt : {
        type :  Date
    }
}, {timestamps : true})

export const  ValidateUser = model("validateUser", validateUserSchema)