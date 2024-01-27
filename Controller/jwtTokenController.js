import jwt from 'jsonwebtoken'
import crypto, { randomBytes } from 'crypto'
import { accessSecretKey, jwtExpires } from '../config.js'


export const signToken = (data) => {

     // secret key
     const secretKey = randomBytes(64).toString('hex')

    return  jwt.sign(data, accessSecretKey, {expiresIn : jwtExpires})

  } 