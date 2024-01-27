
// try and catch
export const tryCatch = (controller) => async(req, res, next) => {
    try {
        await controller (req, res, next)
    } catch (error) {
        next(error)
    }
}



// appError
export const appError = class appError extends Error{
    constructor(statusCode, message){
        super(message)
        this.statusCode = statusCode
    }
}