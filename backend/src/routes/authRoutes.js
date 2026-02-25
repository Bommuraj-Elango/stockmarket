import express from 'express';
import {
  buyerLogin,
  buyerSignup,
  companyLogin,
  companySignup
} from '../controllers/authController.js';

const router = express.Router();

router.post('/company/signup', companySignup);
router.post('/company/login', companyLogin);
router.post('/buyer/signup', buyerSignup);
router.post('/buyer/login', buyerLogin);

export default router;
