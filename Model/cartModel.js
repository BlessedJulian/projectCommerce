import mongoose from "mongoose";

// destructuring
const {Schema, model} = mongoose

const cartSchema = new Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "USER_DB"
    },
    category : {
        type : String,
        required : true
    },
    productId: {
        type : Number,
        required : true,
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
    },
    quantity : {
        type : Number,
        required : true,
        trim : true,
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
    total : {
        type : Number,
        required : true
    }
},{timestamps : true})

export const CART_DB= model("cart", cartSchema)