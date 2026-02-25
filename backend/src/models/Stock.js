import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    stockName: { type: String, required: true, trim: true },
    stockPrice: { type: Number, required: true, min: 0 },
    totalStocksAvailable: { type: Number, required: true, min: 0 },
    soldQuantity: { type: Number, default: 0, min: 0 },
    profitPercentage: { type: Number, default: 0 },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

stockSchema.virtual('remainingStocks').get(function remainingStocks() {
  return this.totalStocksAvailable - this.soldQuantity;
});

stockSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Stock', stockSchema);
