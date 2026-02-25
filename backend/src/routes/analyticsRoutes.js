import express from 'express';
import { companyAnalytics, marketRanking } from '../controllers/analyticsController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/company', protect, authorize('company'), companyAnalytics);
router.get('/market-ranking', protect, authorize('buyer'), marketRanking);

export default router;
