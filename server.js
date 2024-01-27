import express from 'express'
import { PORT } from './config.js'
import { errorHandler } from './Controller/errorHandler.js'
import { appError } from './Utils/index.js'
import { USER } from './Route/userRoute.js'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './Controller/dbController.js'
import xss from 'xss-clean'
import { PRODUCTS } from './Route/productRoute.js'

const app = express()

// [[[[[[[[[[[[[[[[[[[[middle ware]]]]]]]]]]]]]]]]]]]
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
    
}
app.use(helmet())
app.use(express.json({limit : '1kb'}))
app.use(xss())

// ==========routes============
// usser route
app.use('/api/v2/user', USER.router)
// product route
app.use('/api/v2/product', PRODUCTS.router)

// Non- existing route
app.all('*', (req, res, next) => {
    throw new appError(404, `Page not found`)
})

console.log({Mode  : process.env.NODE_ENV})

// db connection
dbConnection()

// hanling global error
app.use(errorHandler)

// app listen
app.listen(PORT, (error) => {
    if(error) console.log({errMsg : error.message}) 
    console.log(`App up and running 😀😀😀 on ${PORT}`)
})
