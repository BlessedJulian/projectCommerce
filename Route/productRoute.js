import express from 'express'
import { allProduct, createProduct, searchProduct, updatedProduct } from '../Method/productMethod.js'
import { assignPermission, requireToken } from '../middleWare/authorization.js'

const router = express.Router()


router

// create product
.post('/createProduct', requireToken, assignPermission("admin"), createProduct)


// get all product
.get('/allProduct', requireToken, allProduct)


// updated product
.post('/updateProduct', requireToken, updatedProduct)

   // search for product
   .get('/search', requireToken, searchProduct )



export const PRODUCTS = {
    router
}