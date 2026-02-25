import mongoose from 'mongoose';

const purchasedStockSchema = new mongoose.Schema(
  {
    stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    quantity: { type: Number, required: true, min: 1 },
    buyPrice: { type: Number, required: true, min: 0 }
  },
  { _id: false, timestamps: true }
);

const buyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    walletBalance: { type: Number, default: 100000, min: 0 },
    role: { type: String, default: 'buyer', immutable: true },
    purchasedStocks: { type: [purchasedStockSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model('Buyer', buyerSchema);
