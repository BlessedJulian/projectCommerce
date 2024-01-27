import { appError, tryCatch } from "../Utils/index.js"
import { responseHandler } from "../Controller/responseHandler.js";
import { PRODUCT_DB } from "../Model/productModel.js";

// create products
export const createProduct = tryCatch(async(req, res) => {
    const user = req.user

    const {category, productName, size, quantity, rate, description} = req.body

    // checking if fields are empty
    if(!category || !productName || !size || !quantity || !rate || !description)
        throw new appError(400, `Please All field are required`)


    const findProduct = await PRODUCT_DB?.findOne({productName,size}).select({
        _id : 1,
        size :1,
        productName : 1,
    })


    // checking if product and size exist 
    if(findProduct)throw new appError(400, "product  and size already exist ")

    // generating product code
    const genProductId = Math.floor(1000 + Math.random() * 9000) 
    return res.send({genProductId : genProductId})
    // calculating the total sum of each product
    const total = parseInt(rate * quantity)

        const addProduct = new PRODUCT_DB({
            userId : user,
            category,
            productId : genProductId,
            productName, 
            size, 
            quantity,
            description,
            rate,
            amount : total
        })
    
        await addProduct.save()
    
        responseHandler(req, res , 201, 0, addProduct )
    

       
})

// get all products
export const allProduct = tryCatch(async(req, res) => {
    const user = req.user
    const {role} = user


    if(role === "admin"){
        
    const product = await PRODUCT_DB?.find().select({
        category : 1, 
        productId : 1, 
        productName : 1,
         size : 1, 
         quantity : 1, 
         description : 1,
         rate: 1,
         amount : 1,
         currency : 1,
         _id : 0
    }).sort({productId : 1})
        

        responseHandler(req, res, 200, 0, product)


    }else{
        const product = await PRODUCT_DB?.find().select({
            category : 1, 
            productId : 1, 
            productName : 1,
            size : 1,  
            description : 1,
            rate: 1,
            currency : 1,
            _id : 0
        }).sort({productId : 1})
        responseHandler(req, res, 200, 0, product)
    }

})

export const updatedProduct = tryCatch(async(req, res) => {
    const user = req.user
    const {productName, quantity,amount } =req.body

    // checking if fields are empty
    if(!productName || !quantity || !allProduct)
        throw new appError(400, "All fields are required")

    const findProduct = await PRODUCT_DB?.findOne({productName}).select({

        productName : 1, 
         quantity : 1, 
         amount : 1,
         currency : 1,
         _id : 0

    })
    
    return res.send(findProduct)

})





// search for product
export const searchProduct = tryCatch(async(req, res) => {
    const {productName}  = req.body

    if(!productName) throw new appError(400, "All field are required")

    // checking if the products    
    const searchProduct = await PRODUCT_DB?.filter(productName)


    return res.send({searchProduct})
    // checking if product exist
    if(!searchProduct) 
    throw new appError(400, 'no product found')



     const hhh = searchProduct.map((x) => {
        const {productId, productName, size, quantity, currency, rate} = x
        const items = {productId, productName, size, currency, rate}
        return items
     }) 

    // if(availableProduct=== 0)
    //     throw new appError(400, `${productName.toUpperCase()}  is out of stock`)



        // searchProduct[0].quantity = undefined
        
            responseHandler(req, res, 200, 0, hhh)
        
       
    
    
})