const router = require('express').Router()
const {getCurrentWeather, getWeatherForecast} = require('../../controllers/weatherController')
const {protect} = require('../../controllers/authController')


/**
 * @swagger
 * tags:
 *  name: Current Weather 
 *  description: Current Weather forecast
 * /api/v1/weather/current:
 *  get:
 *      summary: Current Weather Forecast
 *      tags: [Weather]             
 *      responses:
 *          200:
 *              description: Current Weather Forecast
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/weather'
 *          500:
 *              description: Internal Server Error
 */






router.get('/current',protect,getCurrentWeather)
router.get('/forecast/daily',protect,getWeatherForecast)



module.exports = router