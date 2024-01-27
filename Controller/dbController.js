import mongoose from "mongoose";
import { DB } from "../config.js";

export const dbConnection = async(req, res) =>{
    mongoose.set('setDefaultsOnInsert', false);
    const {connect } = mongoose
    const dbcon = await connect(DB, console.log(`db connected......`)).catch(error => console.log({dbMsg : error.message}));
}