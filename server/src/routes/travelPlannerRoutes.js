import express from 'express';
import { createTravelPlan } from '../controllers/travelPlannerController.js';

const router = express.Router();

router.post('/', createTravelPlan);

export default router;
