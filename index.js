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
  origin: '*',  // Allow all origins temporarily for debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Enable pre-flight requests for all routes
app.options('*', cors());

// Routes
app.use("/shops", shopRoutes);
app.use("/shops/:shopId/customers", customerRoutes);
app.use(
  "/shops/:shopId/customers/:customerId/transactions",
  transactionRoutes
);

// Root route
app.get("/", (req, res) => {
  res.send("Shop Money Management API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();