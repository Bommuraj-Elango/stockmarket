import jwt from 'jsonwebtoken';
import Company from '../models/Company.js';
import Buyer from '../models/Buyer.js';

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: token missing' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'company') {
      req.user = await Company.findById(decoded.id).select('-password');
    } else {
      req.user = await Buyer.findById(decoded.id).select('-password');
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: user not found' });
    }

    req.userRole = decoded.role;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: invalid token' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.userRole)) {
    return res.status(403).json({ message: 'Forbidden: role access denied' });
  }
  return next();
};
