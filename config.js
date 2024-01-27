import env from "dotenv"

env.config()

export const PORT = process.env.PORT
export const DB = process.env.dbConnect
export const accessSecretKey = process.env.accessKey
export const jwtExpires = process.env.time
export const USER = process.env.user
export const  PASS = process.env.pass