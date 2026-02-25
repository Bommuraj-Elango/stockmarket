import Buyer from '../models/Buyer.js';
import Company from '../models/Company.js';
import Stock from '../models/Stock.js';
import Transaction from '../models/Transaction.js';

export const createStock = async (req, res) => {
  const { stockName, stockPrice, totalStocksAvailable, profitPercentage, description } = req.body;
  if (!stockName || stockPrice === undefined || totalStocksAvailable === undefined) {
    return res.status(400).json({ message: 'stockName, stockPrice and totalStocksAvailable are required' });
  }

  const stock = await Stock.create({
    company: req.user._id,
    stockName,
    stockPrice,
    totalStocksAvailable,
    profitPercentage,
    description
  });

  return res.status(201).json(stock);
};

export const getCompanyStocks = async (req, res) => {
  const stocks = await Stock.find({ company: req.user._id }).sort({ createdAt: -1 });
  return res.json(stocks);
};

export const updateStock = async (req, res) => {
  const { id } = req.params;
  const stock = await Stock.findOne({ _id: id, company: req.user._id });
  if (!stock) {
    return res.status(404).json({ message: 'Stock not found' });
  }

  const updates = ['stockName', 'stockPrice', 'totalStocksAvailable', 'profitPercentage', 'description'];
  updates.forEach((key) => {
    if (req.body[key] !== undefined) stock[key] = req.body[key];
  });

  if (stock.totalStocksAvailable < stock.soldQuantity) {
    return res.status(400).json({ message: 'totalStocksAvailable cannot be less than soldQuantity' });
  }

  await stock.save();
  return res.json(stock);
};

export const deleteStock = async (req, res) => {
  const { id } = req.params;
  const stock = await Stock.findOneAndDelete({ _id: id, company: req.user._id });
  if (!stock) {
    return res.status(404).json({ message: 'Stock not found' });
  }

  return res.json({ message: 'Stock deleted' });
};

export const listAllStocks = async (req, res) => {
  const { companyName, stockName, sortBy = 'createdAt', order = 'desc' } = req.query;

  const match = {};
  if (stockName) {
    match.stockName = { $regex: stockName, $options: 'i' };
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  const pipeline = [
    { $match: match },
    {
      $lookup: {
        from: 'companies',
        localField: 'company',
        foreignField: '_id',
        as: 'company'
      }
    },
    { $unwind: '$company' }
  ];

  if (companyName) {
    pipeline.push({
      $match: {
        'company.companyName': { $regex: companyName, $options: 'i' }
      }
    });
  }

  pipeline.push({
    $sort: {
      [sortBy]: sortOrder
    }
  });

  const stocks = await Stock.aggregate(pipeline);
  return res.json(stocks);
};

export const listStocksByCompany = async (req, res) => {
  const { companyId } = req.params;
  const company = await Company.findById(companyId).select('-password');
  if (!company) {
    return res.status(404).json({ message: 'Company not found' });
  }

  const stocks = await Stock.find({ company: companyId }).sort({ createdAt: -1 });
  return res.json({ company, stocks });
};

export const buyStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'quantity must be at least 1' });
  }

  const stock = await Stock.findById(id);
  if (!stock) {
    return res.status(404).json({ message: 'Stock not found' });
  }

  const remaining = stock.totalStocksAvailable - stock.soldQuantity;
  if (remaining < quantity) {
    return res.status(400).json({ message: 'Not enough stock available' });
  }

  const totalAmount = stock.stockPrice * quantity;

  const buyer = await Buyer.findById(req.user._id);
  if (buyer.walletBalance < totalAmount) {
    return res.status(400).json({ message: 'Insufficient wallet balance' });
  }

  stock.soldQuantity += quantity;
  await stock.save();

  buyer.walletBalance -= totalAmount;
  buyer.purchasedStocks.push({
    stock: stock._id,
    company: stock.company,
    quantity,
    buyPrice: stock.stockPrice
  });
  await buyer.save();

  await Company.findByIdAndUpdate(stock.company, {
    $inc: {
      totalStocksSold: quantity,
      revenueGenerated: totalAmount
    }
  });

  const transaction = await Transaction.create({
    buyer: buyer._id,
    stock: stock._id,
    company: stock.company,
    quantity,
    unitPrice: stock.stockPrice,
    totalAmount
  });

  return res.status(201).json({
    message: 'Stock purchased successfully',
    transaction
  });
};
