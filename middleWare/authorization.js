import { appError, tryCatch } from '../Utils/index.js';
import jwt from 'jsonwebtoken'
import { accessSecretKey } from "../config.js";
import { USER_DB } from "../Model/userModel.js";



export const requireToken = tryCatch(async(req, res, next) =>{

    const authHeader = req.headers?.authorization

    const token = authHeader?.startsWith("accessToken") && authHeader?.split(" ")[1]

    if(!token || token === null)   throw new appError(403, 'invalid header')

    // verify token
    await jwt.verify(token, accessSecretKey, async(error, payload) =>{
          if (error)  throw new appError (400, error.message);
    
        
    req.data = payload.data


    const user = await USER_DB?.findById(payload.data).select({
        fullname : 1,
        username : 1,
        email : 1,
        phone : 1,
        verified : 1,
        role : 1
    })

    req.user = user
  
    if(!user) throw new appError(400, "Session expired")
   
    next()

    })  

}) 


export const assignPermission = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role))
            throw new appError(403, `you do not have permission to access this Page`)

        next()

    }
}