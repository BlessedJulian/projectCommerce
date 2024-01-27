

export const jwtCookie =(res, token) => {

    const option = {
        // maxage : new Date(Date.now()) + 5 * 24 * 60 * 60 * 1000,
        maxAge:    10 * 60 * 1000,
        httpOnly : true ,
        // secure : true
    }

    if (process.env.NODE.ENV === "production"){
            option.secure = true
    }
    
    res.cookie('accessToken', token, option)

}