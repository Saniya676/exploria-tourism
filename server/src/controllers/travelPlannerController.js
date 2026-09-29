import { generateTravelPlan } from '../services/travelPlannerService.js';

export async function createTravelPlan(req, res, next) {
  try {
    const plan = await generateTravelPlan(req.body);
    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    next(error);
  }
}
