import { cookie, validationResult } from "express-validator"
import { appError, tryCatch } from "../Utils/index.js"
import { USER_DB } from "../Model/userModel.js"
import { responseHandler } from "../Controller/responseHandler.js"
import bcrypt from 'bcrypt'
import { PASS, USER,} from "../config.js"
import nodemailer, { createTransport } from 'nodemailer'
import { ValidateUser } from "../Model/validateUser.js"
import { PRODUCT_DB } from "../Model/productModel.js"
import { signToken } from "../Controller/jwtTokenController.js"
import { jwtCookie} from "../Controller/cookieController.js"
import { CART_DB } from "../Model/cartModel.js"



// user sign up
export const signUp = tryCatch(async(req, res, next) => {

    const {fullname, username, email, phone, address, password, confirmPassword} = req.body

    // checking if fields are empty
    if(!fullname || !username || !email || !phone || !address || !password || !confirmPassword)
        throw new appError(400, 'Please fill all fields')


    // user error 
    const error = validationResult(req)
    if(!error.isEmpty()){
        const errorObj = error.array().map((err) => err.msg)
        throw new appError(422, errorObj)
    }

    //checking if password match
    if(password != confirmPassword) throw new appError(422, 'password match')

    // checking if user exist
    const user =  await USER_DB?.findOne({username})
    const userEmail =  await USER_DB?.findOne({email})
    const userPhone =  await USER_DB?.findOne({phone})

    if(user) throw new appError(422, 'username already exist')
    if(userEmail) throw new appError(422, 'Email already exist')
    if(userPhone) throw new appError(422, 'Phone number already exist')


    // add new user
    const addUser = new USER_DB({
        fullname,
         username, 
         email, 
         phone, 
         address, 
          password
    })

    await addUser.save()

    addUser.password = undefined


    req.email = email

    // responseHandler(req, res, 201, 0, addUser.email)
    

     next()
})


// Email verification
export const verifyEmail =tryCatch (async(req, res, next) =>{
    const email =  req.email


    // generate OTP
    const OTP = Math.floor(Math.random() * 8999 + 100000) 

        const transporter =  nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : USER,
                pass : PASS
            } 
        })
         
        const message = `Hi ${email}, your OTP : ${OTP} expires in 1Ominutes`
            const  mailOption = {
                from : USER,
                to : email,
                subject : 'Email Verification',
                text : message   
            }

        transporter.sendMail(mailOption, async(error, info) => {
            // if(error) throw new appError(400, error.message)

            if(error){

               return  res.json({
                    error : true,
                    responseCode : 400,
                    message : error.message

                    })
            

                }else{  

                const newMail = await ValidateUser.create({
                    email : email,
                    otp : OTP,
                    expiredAt : Date.now() + 360000
                })
   
    
                responseHandler(req, res, 200, 0, 'OTP sent to your email')    

            }
        })
    })


// validate User Email
export const validateEmail = tryCatch(async(req, res) => {
    
    const {email, OTP} =req.body

    // checking if OTP field is empty
    if(!OTP) throw new appError(400, 'OTP field is empty')

    // checking otp length
    if(OTP.length != 6) throw new appError(400, "Invalid OTP")

    // checking user is  already verified
    // const verifiedUser = await USER_DB?.findOne({email}).select({_id : 0, verified : 1})

    // if(verifiedUser.verified == true) {
    //    return responseHandler(req, res, 200, 0, 'User already verified')
    // }

    const user = await ValidateUser?.findOne({email}).select({
        _id : 0,
        email : 1,
        otp : 1,
        createdAt : 1,
        expiredAt : 1
    })

    const {email : Email, otp, createdAt, expiredAt} = user

    // checking if otp match
    const compareOTP =  otp === OTP
    if(!compareOTP) throw new appError(400, "Invalid OTP")


    // checking if OTP has expired
    const expired =   Date.parse(expiredAt)

    // const currentDate = new Date(expired);
    // const currentDateTime = currentDate.toLocaleString();


    const compareTime = Date.now() > expired

    if(compareTime) throw new appError(400, "Expired OTP")

    const updateUser = await USER_DB?.findOneAndUpdate({email}, {$set : {verified : true}}, {new : true})

    responseHandler(req, res, 200, 0, 'User verified, proceed to Log In')

})


// user login
export const logIn = tryCatch(async(req, res) => {
    const {username, email, password} = req.body

    // checking if fields are empty
    if(!(username || email) || !password)
      throw new appError(400, 'please input your details to Log in')

    //  checking username of user
    //   const user  = await USER_DB?.findOne(username? {username} : {email}).select('+password')
    const user  = await USER_DB?.findOne({$or:[{username}, {email: username}]}).select('+password')
    //   return res.send(user._id)0

      if(!user) throw new appError(400, 'wrong details')



    //   comparing hashed password
    const comparePassword = await bcrypt.compare(password, user.password)

    if(!comparePassword) throw new appError(400, 'wrong details')


    // checking if user is verified
    if(user.verified == false) throw new appError(400, 'please verified email before you login')

    // Access Secret Key

      const{_id} = user

      const token = signToken({data : _id})   
      
      const cookie = jwtCookie( res, token)


    responseHandler(req, res, 200, 0, token)

})


// User log out
export const logOut = tryCatch(async(req, res) => {
    
//    const ggg = delete req.headers.authorization;
    res.clearCookie('accessToken');

    const timee =  new Date().toLocaleString()


    responseHandler(req, res, 200, 0, timee)
})

// check all user transaction
export const allTransaction  = tryCatch(async(req, res) => {

    const allTransaction = await PRODUCT_DB?.find({userId : req.user._id})
    
    return res.send(allTransaction)
})


// forget password
export const  forgetpassword = tryCatch(async(req, res, next) => {
    const {email} = req.body
    
    // checking if email is empty
    if(!email) throw new appError(400, 'Valid email is required')

    const user = await USER_DB?.findOne({email}).select({email : 1 , _id : 0})

    if(!user) throw new appError(400, "user with this email not found")

    // generate password token to user
    const passwordResetToken = crypto.randomBytes(32).toString('hex')
    

    //   send passwordResttoken to user through email
    const mailer = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : USER,
            pass : PASS
        }
    })

    const message = `Hi, ${email}  click on this link to reset your password\n http://localhost:3000/api/v2/user/resetPassword/${passwordResetToken} expires in 10minutes`
    
    const options = {
        from : USER,
        to : email,
        subject : "Password Reset Token",
        text : message
    }

    mailer.sendMail(options, async(error, info) => {
        if(error){
            return res.send({
                error : true,
                responseCode : 400,
                message : error.message
            })
        }else{
            const userEmail = await USER_DB?.findOneAndUpdate({email}, {$set: {
                passwordResetToken,
                expiredAt : Date.now() + 360000,
            }},  {new : true})


            responseHandler(req, res, 200, 0, 'Pasword reset token has been sent to your email')   
        }
    })
})



// resetpassword
export const resetpassword = tryCatch(async(req, res, next) => {

    const {password, confirmPassword} = req.body

    const token = req.params

    // find user
    const user = await USER_DB?.findOne(token).select({
        passwordResetToken : 1,
        expiredAt : 1,
    }) 


    // checking if user token exist
    if(!user) throw new appError(400, 'invalid user')

 
    // compare time
    const expired = Date.parse(user.expiredAt)

    const compareTime = expired > Date.now()

    if(!compareTime) throw new appError(400, 'Expired token')

    // checking if fields are empty
    if(!password || !confirmPassword) throw new appError(400, 'All field are required')

    // user error
     const error = validationResult(req)
     if(!error.isEmpty()){
         const errorObj = error.array().map((err) => err.msg)
         throw new appError(422, errorObj)
     }

    // checking if password match
    if(password != confirmPassword) throw new appError(400, 'mismatch password')

    const hashPassword = await bcrypt.hash(password, 12)


    const updateUser = await USER_DB?.findByIdAndUpdate(user._id, {$set: 
        {password :hashPassword}}, {new : true})

    responseHandler(req, res, 201, 0, 'password updated')
 
})


// add to user cart
export const addUserCart = tryCatch(async(req, res) => {
    const user = req.user._id 
    const {productName, size, quantity} = req.body
    
    // checking if fields is empty
    if(!productName || !size || !quantity) throw new appError(400, "All field is required")


    

    // checking if product exist 
    const findProduct = await PRODUCT_DB?.findOne({productName, size}).select({
        category : 1, 
        productId : 1, 
        productName : 1,
         size : 1, 
         quantity : quantity, 
         rate : 1,
         currency : 1,
         _id : 0
    })


    if(!findProduct) throw new appError(400, `${productName} is an invalid product`)

   
    const totalSum  = parseInt(findProduct.rate * quantity)
    

     // add product user cart
     const addtoUserCart = new CART_DB({    
        userId : user, 
        category : findProduct.category, 
        productId : findProduct.productId, 
        productName,
         size, 
         quantity, 
         rate : findProduct.rate,
         currency : findProduct.currency,
         total : totalSum,
         productstotal : totalSum
    })

    const productExist = await CART_DB?.findOne({productName})

    if(productExist) {
        const rate = addtoUserCart.rate
       const update = await CART_DB.findOneAndUpdate({productName}, {$set: {
            quantity,
            total: parseInt(rate * quantity),
            productstotal :  parseInt(rate * quantity)
        }},{new : true})

        responseHandler(req, res, 200, 0, "product has been updated")

       
        }else{

        await addtoUserCart.save()

        responseHandler(req, res, 200, 0, "product has been added to your cart")

    }
      
})



// user cart
export const userCart = tryCatch(async(req, res) =>{

    const cart = await CART_DB?.find({userId : req.user._id}).select({
        category : 1,
        productId : 1, 
        productName : 1,
        size : 1, 
        quantity : 1,
        rate : 1, 
        currency : 1, 
        total: 1,  
        _id : 0

    }).sort()

    // return res.send(cart)
    

  // A callback function that adds the price of each product to the accumulator
  const jace = cart[0]
  const totalamount = 0
  const sumPrices = (totalamount, jace) => totalamount + jace.total;


  // An initial value of zero for the accumulator
  const initialValue = 0;
  
  // Use the array.reduce method to calculate the total price
  const totalPrice = cart.reduce(sumPrices, initialValue);
  

    if(cart.length === 0) {
        responseHandler(req, res, 200, 0, 'Your cart is empty')

    }else{

        responseHandler(req, res, 200, 0, {cart : cart, Total : totalPrice})
    }

})

