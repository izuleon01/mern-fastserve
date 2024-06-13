import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import healthcheckRoutes from './routes/healthcheck';
import menuRoutes from './routes/menu';
import orderRoutes from './routes/order';
import mongoose from 'mongoose';

// Initialize Express application
const app = express();

// Connect to MongoDB using environment variables
mongoose.connect(process.env.MONGODB_URI as string, {
    dbName: process.env.MONGODB_DBNAME,
});

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

// Routes setup
app.use('', healthcheckRoutes); // Healthcheck route
app.use('/menu', menuRoutes); // Menu-related routes
app.use('/order', orderRoutes); // Order-related routes

// Start the server
app.listen(process.env.PORT, () => {
    console.log('Server started');
});
