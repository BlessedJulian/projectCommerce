export const responseHandler =  (req, res, statusCode, responseCode, responseMessage) => {
    return res.status(statusCode).json({
        error : false,
        status : 'success',
        successCode : statusCode,
        responseCode,
        responseMessage
    })
}