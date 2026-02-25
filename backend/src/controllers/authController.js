import bcrypt from 'bcryptjs';
import Buyer from '../models/Buyer.js';
import Company from '../models/Company.js';
import { generateToken } from '../utils/token.js';

const sanitizeUser = (doc) => ({
  id: doc._id,
  email: doc.email,
  role: doc.role,
  name: doc.name,
  companyName: doc.companyName,
  industry: doc.industry,
  description: doc.description,
  walletBalance: doc.walletBalance
});

export const companySignup = async (req, res) => {
  const { companyName, email, password, industry, description } = req.body;
  if (!companyName || !email || !password || !industry) {
    return res.status(400).json({ message: 'companyName, email, password and industry are required' });
  }

  const exists = await Company.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: 'Company already exists with this email' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const company = await Company.create({
    companyName,
    email,
    password: hashed,
    industry,
    description
  });

  const token = generateToken({ id: company._id, role: 'company' });
  return res.status(201).json({ token, user: sanitizeUser(company) });
};

export const companyLogin = async (req, res) => {
  const { email, password } = req.body;
  const company = await Company.findOne({ email });
  if (!company) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const matched = await bcrypt.compare(password, company.password);
  if (!matched) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ id: company._id, role: 'company' });
  return res.json({ token, user: sanitizeUser(company) });
};

export const buyerSignup = async (req, res) => {
  const { name, email, password, walletBalance } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }

  const exists = await Buyer.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: 'Buyer already exists with this email' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const buyer = await Buyer.create({
    name,
    email,
    password: hashed,
    walletBalance
  });

  const token = generateToken({ id: buyer._id, role: 'buyer' });
  return res.status(201).json({ token, user: sanitizeUser(buyer) });
};

export const buyerLogin = async (req, res) => {
  const { email, password } = req.body;
  const buyer = await Buyer.findOne({ email });
  if (!buyer) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const matched = await bcrypt.compare(password, buyer.password);
  if (!matched) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ id: buyer._id, role: 'buyer' });
  return res.json({ token, user: sanitizeUser(buyer) });
};
