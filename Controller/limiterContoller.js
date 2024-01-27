import { rateLimit } from "express-rate-limit";

export const logInLimiter = rateLimit({
    max : 200,
    windowMs : 60 * 60 * 1000,
    message : ({
        code : 429,
        message : "Too many login try again after 1 hour 🔥🔥"
    })

})



export const signUpLimiter = rateLimit({
    max : 7,
    windowMs : 60 * 60 * 1000,
    message : ({
        code : 429,
        message : "Too many login try again after 1 hour 🔥🔥"
    })

})