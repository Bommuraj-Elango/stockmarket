import express from 'express';
import {
  buyStock,
  createStock,
  deleteStock,
  getCompanyStocks,
  listAllStocks,
  listStocksByCompany,
  updateStock
} from '../controllers/stockController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('buyer'), listAllStocks);
router.get('/company/:companyId', protect, authorize('buyer'), listStocksByCompany);
router.post('/:id/buy', protect, authorize('buyer'), buyStock);

router.post('/', protect, authorize('company'), createStock);
router.get('/my/list', protect, authorize('company'), getCompanyStocks);
router.put('/:id', protect, authorize('company'), updateStock);
router.delete('/:id', protect, authorize('company'), deleteStock);

export default router;
