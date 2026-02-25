import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true, index: true },
    stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
