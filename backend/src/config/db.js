import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is required in environment variables');
  }

  await mongoose.connect(mongoUri, {
    autoIndex: true
  });
  console.log('MongoDB connected');
};
