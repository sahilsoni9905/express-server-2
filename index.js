import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import shopRoutes from "./routes/shops.js";
import customerRoutes from "./routes/customers.js";
import transactionRoutes from "./routes/transactions.js";

// Load environment variables
dotenv.config({
  path: "./.env",
});

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: ['https://expense-tracker-olive-phi.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/shop-money-manager"
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Routes
app.use("/api/shops", shopRoutes);
app.use("/api/shops/:shopId/customers", customerRoutes);
app.use(
  "/api/shops/:shopId/customers/:customerId/transactions",
  transactionRoutes
);

// Root route
app.get("/", (req, res) => {
  res.send("Shop Money Management API is running");
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();