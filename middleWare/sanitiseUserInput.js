import { check } from "express-validator";

// Sign Up
export const santiseUserSignUpInput = [
    // fullname
    (check('fullname').trim().escape()
    .matches('^[A-Za-z ]+$').withMessage('Fullname should only contain alphabets')
    .isLength({
        min : 3,
        max : 20
    }).withMessage('Fullname requir mininum of 3 characters and maxmum of 20 charcters')),

    // username
    check('username').trim().escape()
    .matches('^[A-Za-z0-9]+$').withMessage('Username should only contain alphabets and numbers')
    .isLength({
        min : 3,
        max : 15
    }).withMessage('Username require mininum of 3 characters and maxmum of 15 charcters'),

    // email
    check('email').trim().escape()
    .isEmail().withMessage('Invalid email address'),

    // phone
    check("phone").escape()
    .matches('^[0-9]+$').withMessage('Phone number should only contain numbers')
    .isLength({
        min : 11,
        max : 11
    }).withMessage('Invalid phone number'),

    // Address
    check('address').trim().escape()
    .matches('^[A-Za-z0-9,:@ ]+$').withMessage('Invalid characters value')
    .isLength({
        min : 10 ,
        max : 50
    }).withMessage('Invalid address syntax'),

    // password
    check("password").trim().escape()
    .isStrongPassword({
        minLength : 6,
        minNumber : 1,
        minLowercase : 1,
        minUppercase : 1,
        minSymbols : 1
    }).withMessage('Password should at least contain 1 uppercase, lowercase, number, special character and should not be less than 6 characters')
    .isLength({max : 10}).withMessage('password should not be more than 10 characters'),

    // confirm Password
    check('confirmPassword').trim().escape()
]

// Login
export const sanitiseUserLogIn = [
    // username
    check('username').trim().escape(),

    // email
    check('email').trim().escape(),

    // password
    check('password').trim().escape()

]

// reset password input
export const resetPasswordInput = [
    check('password').trim().escape()
    .isStrongPassword({
        minNumber : 1,
        minUppercase : 1,
        minLength : 1,
        minSymbols : 1,
        minLowercase : 1
    }).withMessage('Password should at least contain 1 uppercase, lowercase, number, special character and should not be less than 6 characters')
    .isLength({max : 10}).withMessage('password should not be more than 10 characters')
]