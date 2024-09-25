
const WEATHER_API_URL = process.env.WEATHER_API
const API_KEY = process.env.API_KEY
const StatusCode = require('../utils/appStatusCodes')
exports.getCurrentWeather=async(request, response)=>{
    
    const {city, countryCode} = await request.query
    try{
        if(!city || !countryCode){
            return response.status(StatusCode.BAD_REQUEST).json({
                status:'fail',
                message:'city and country_code is required',
                statusCode: StatusCode.BAD_REQUEST
            })
        }
        const api_response = await fetch(`${WEATHER_API_URL}/current?key=${API_KEY}&city=${city}&country=${Number(countryCode)}`)
        if(api_response.ok){
            const data = await api_response.json()
            return response.status(StatusCode.SUCCESSFULL_REQUEST).json({
                status:'success',
                data,
                statusCode: StatusCode.SUCCESSFULL_REQUEST
            })
        }
        if(!api_response.ok){
            const data = await api_response.json()
            return response.status(StatusCode.BAD_REQUEST).json({
                status:'fail',
                data:{
                    data
                },
                statusCode: StatusCode.BAD_REQUEST
            })
        }
    }catch(error){
        return response.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            status:'fail',
            message:"Internal Server Error",
            statusCode: StatusCode.INTERNAL_SERVER_ERROR
        })
    }
}

exports.getWeatherForecast=async(request, response)=>{
    const {city, countryCode} = await request.query
    try{
        if(!city || !countryCode){
            return response.status(StatusCode.BAD_REQUEST).json({
                status:'fail',
                message:'city and country_code is required',
                statusCode: StatusCode.BAD_REQUEST
            })
        }
        const api_response = await fetch(`${WEATHER_API_URL}/forecast/daily?key=${API_KEY}&city=${city}&country=${countryCode}`)
        if(api_response.ok){
            const data = await api_response.json()
            return response.status(StatusCode.SUCCESSFULL_REQUEST).json({
                status:'success',
                data,
                statusCode: StatusCode.SUCCESSFULL_REQUEST
            })
        }
        if(!api_response.ok){
            const data = await api_response.json()
            return response.status(StatusCode.BAD_REQUEST).json({
                status:'fail',
                data:{
                    data
                },
                statusCode: StatusCode.BAD_REQUEST
            })
        }
    }catch(error){
        return response.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            status:'fail',
            message:"Internal Server Error",
            statusCode: StatusCode.INTERNAL_SERVER_ERROR
        })
    }
}