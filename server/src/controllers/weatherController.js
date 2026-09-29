import { fetchWeather } from '../services/weatherService.js';

export async function getWeather(req, res, next) {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required'
      });
    }

    const weatherData = await fetchWeather(city);
    res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    next(error);
  }
}
