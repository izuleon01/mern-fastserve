import express, { Request, Response } from 'express'; // Importing Express and its types for Request and Response
import cors from 'cors'; // Importing CORS middleware
import 'dotenv/config'; // Loading environment variables from .env
import healthcheckRoutes from './routes/healthcheck'; // Importing healthcheck routes
import menuRoutes from './routes/menu'; // Importing menu routes
import orderRoutes from './routes/order'; // Importing order routes
import mongoose from 'mongoose'; // Importing Mongoose for MongoDB integration

// Initialize Express application
const app = express();

// Connect to MongoDB using environment variables
mongoose.connect(process.env.MONGODB_URI as string, {
    // Connecting to MongoDB with provided URI
    dbName: process.env.MONGODB_DBNAME, // Specifying database name from environment variables
});

// Middleware setup
app.use(express.json()); // Middleware to parse JSON bodies of incoming requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies of incoming requests
app.use(cors()); // Middleware to enable Cross-Origin Resource Sharing (CORS)

// Routes setup
app.use('', healthcheckRoutes); // Mounting healthcheck routes under the root path (/)
app.use('/menu', menuRoutes); // Mounting menu-related routes under the /menu path
app.use('/order', orderRoutes); // Mounting order-related routes under the /order path

// Start the server
app.listen(process.env.PORT, () => {
    // Starting the server on the port specified in the environment variable PORT
    console.log('Server started'); // Logging a message to indicate server startup
});
