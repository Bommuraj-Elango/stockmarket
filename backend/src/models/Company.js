import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    industry: { type: String, required: true },
    description: { type: String, default: '' },
    role: { type: String, default: 'company', immutable: true },
    totalStocksSold: { type: Number, default: 0 },
    revenueGenerated: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Company', companySchema);
