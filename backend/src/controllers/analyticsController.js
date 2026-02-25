import Company from '../models/Company.js';
import Stock from '../models/Stock.js';
import Transaction from '../models/Transaction.js';

export const companyAnalytics = async (req, res) => {
  const companyId = req.user._id;

  const stocks = await Stock.find({ company: companyId });
  const totalStocksListed = stocks.reduce((sum, s) => sum + s.totalStocksAvailable, 0);
  const totalSold = stocks.reduce((sum, s) => sum + s.soldQuantity, 0);
  const remaining = totalStocksListed - totalSold;

  const company = await Company.findById(companyId).select('companyName revenueGenerated totalStocksSold');

  const trend = await Transaction.aggregate([
    { $match: { company: companyId } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: '$totalAmount' },
        volume: { $sum: '$quantity' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  return res.json({
    company,
    summary: {
      totalStocksListed,
      totalStocksSold: totalSold,
      remainingStocks: remaining,
      revenueGenerated: company?.revenueGenerated ?? 0
    },
    trend: trend.map((t) => ({
      period: `${t._id.year}-${String(t._id.month).padStart(2, '0')}`,
      revenue: t.revenue,
      volume: t.volume
    }))
  });
};

export const marketRanking = async (req, res) => {
  const ranking = await Company.aggregate([
    {
      $lookup: {
        from: 'stocks',
        localField: '_id',
        foreignField: 'company',
        as: 'stocks'
      }
    },
    {
      $addFields: {
        avgProfitPercentage: { $avg: '$stocks.profitPercentage' },
        activeStocks: { $size: '$stocks' }
      }
    },
    {
      $project: {
        companyName: 1,
        revenueGenerated: 1,
        totalStocksSold: 1,
        avgProfitPercentage: { $ifNull: ['$avgProfitPercentage', 0] },
        activeStocks: 1
      }
    },
    { $sort: { revenueGenerated: -1, avgProfitPercentage: -1 } }
  ]);

  const topProfitCompany = [...ranking].sort((a, b) => b.avgProfitPercentage - a.avgProfitPercentage)[0] ?? null;

  return res.json({
    topProfitCompany,
    ranking
  });
};
