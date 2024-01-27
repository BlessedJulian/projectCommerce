import express from 'express'
import { addUserCart, allTransaction, forgetpassword, logIn, logOut, resetpassword,  signUp,  userCart,  validateEmail,  verifyEmail } from '../Method/userMethod.js'
import { resetPasswordInput, sanitiseUserLogIn, santiseUserSignUpInput } from '../middleWare/sanitiseUserInput.js'
import { logInLimiter, signUpLimiter } from '../Controller/limiterContoller.js'
import { requireToken } from '../middleWare/authorization.js'

const router = express.Router()


router
    // for sign up 
    .post('/signUp', signUpLimiter, santiseUserSignUpInput, signUp, verifyEmail,)
    // for  log in
    .post('/logIn', logInLimiter, sanitiseUserLogIn, logIn)
    // for user log out
    .get('/logOut', logOut)


    
    // for  verify email
        // .post('/verifyEmail', verifyEmail)
    // for  email validation
    .post('/validateEmail', validateEmail)

    // all user transaction
    .get('/allTransaction', requireToken, allTransaction)

    // user cart
    .post('/addCart', requireToken, addUserCart)
    .get('/cart', requireToken, userCart)

    // forget password
    .post('/forgetpassword', forgetpassword)

    // reset password
    .patch('/resetPassword/:passwordResetToken', resetPasswordInput, resetpassword)

 



export const USER = {
    router
}