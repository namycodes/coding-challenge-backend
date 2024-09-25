const User = require("../models/users")
const jwt = require('jsonwebtoken')
const StatusCode = require('../utils/appStatusCodes')
const {promisify} = require('util')
const Sign_JWT=async(_id)=>{
    return await jwt.sign({_id}, process.env.JWT_SECRET,{
        expiresIn: process.env.MAX_AGE
    })
}

exports.Login=async(request, response)=>{
    try {
        const {email,password} = await request.body
        if(!email || !password){
            return response.status(StatusCode.BAD_REQUEST).json({
                status:"fail",
                message:'email and password is required',
                statusCode: StatusCode.BAD_REQUEST
            })
        }

        const appUser = await User.findOne({email}).select('+password')
        if(!appUser || !(await appUser.correctPassword(password,appUser.password))){
            return response.status(StatusCode.UNAUTHORIZED).json({
                status:'fail',
                message:'Wrong email or password',
                statusCode: StatusCode.UNAUTHORIZED
            })
        }

        const token = await Sign_JWT(appUser._id)
        return response.status(StatusCode.SUCCESSFULL_REQUEST).json({
            status:'success',
            token,
            message:'Authentication Successfull',
            statusCode: StatusCode.SUCCESSFULL_REQUEST
        })
        
        
    } catch (error) {
       return response.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            status:'fail',
            message:'Internal Server Error',
            statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            error
        })
    }
}
exports.Signup=async(request, response)=>{
    try {
        const {
            email,
            password,
            username,
            firstName,
            lastName,
            confirmPassword
        } = await request.body
        
        const newUser = await User.create({
            email,
            password,
            username,
            firstName,
            lastName,
            confirmPassword
        })
        return response.status(StatusCode.POST_SUCCESSFULL).json({
            status:'success',
            message:'Account Created Successfully',
            statusCode: StatusCode.POST_SUCCESSFULL
        })
    } catch (error) {
        return response.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            status:'fail',
            message: error.message,
            statusCode: StatusCode.INTERNAL_SERVER_ERROR,
           
        })
    }
}

exports.protect=async(request, response, next)=>{
    try{
        let token;
        if(request.headers.authorization && request.headers.authorization.startsWith('Bearer')){
            token = request.headers.authorization.split(' ')[1]
        }
        if(!token){
            return response.status(StatusCode.UNAUTHORIZED).json({
                status:'fail',
                message:'Unauthorized',
                statusCode: StatusCode.UNAUTHORIZED
            })
        }
        let decoded;
        try{
            decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
        }catch(error){
            return response.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                status:'fail',
                statusCode: StatusCode.INTERNAL_SERVER_ERROR
            })
        }
        console.log("decoded",decoded)
        const freshUser = await User.findById(decoded._id)
        if(!freshUser){
            return response.status(StatusCode.NOT_FOUND).json({
                status:'fail',
                message:'User does not exist',
                statusCode: StatusCode.NOT_FOUND
            })
        }
        if(!freshUser.changedPasswordAfter(decoded.iat)){
            return response.status(StatusCode.UNAUTHORIZED).json({
                status:'fail',
                message:'Unathorised',
                status: StatusCode.UNAUTHORIZED
            })
        }
        request.User = freshUser
        next()
    }catch(error){
        return response.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            status:'fail',
            message:'Internal Server Error',
            statusCode: StatusCode.INTERNAL_SERVER_ERROR
        })
    }
}