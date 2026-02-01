import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Note: In newer Mongoose versions, you don't need
    // deprecated options like useNewUrlParser or useUnifiedTopology
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
