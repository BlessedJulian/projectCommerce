import mongoose from "mongoose";

const {Schema, model} = mongoose

const productSchema = new Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "USER_DB"
    },
    category : {
        type : String,
        enum : ["Drinks",  "Recharge Card", "Water"],
        required : true
    },
    productId: {
        type : String,
        required : true,
        unique : true,
    },
    productName : {
        type : String,
        required : true,
        trim : true,
       uppercase : true,
    },
    size : {
        type : String,
        required : true,
        trim : true,
        uppercase : true
    },
    quantity : {
        type : String,
        required : true,
        trim : true,
        uppercase : true
    },
    description : {
        type : String,
        required : true,
        trim : true
    },
    rate : {
    type : Number,
    required : true,   
    },
    currency : {
        type : String,
        enum : ["NGN", "$"],
        default : "NGN",
        trim : true,
        uppercase : true
    }, 
    amount : {
        type : Number,
        required : true,   
    }

}, {timestamps : true})

export const PRODUCT_DB = model("product", productSchema)