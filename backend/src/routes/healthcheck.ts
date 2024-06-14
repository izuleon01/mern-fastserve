import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

// Create a new Router instance from Express
const router = express.Router();

/**
 * GET endpoint to perform a health check for the server and MongoDB.
 * Retrieves the current status of the server and MongoDB connection.
 */
router.get('/healthcheck', async (req: Request, res: Response) => {
    // Default server status
    let server_status = 'Server is running';

    // Determine MongoDB connection status based on mongoose connection state
    let mongo_status;
    const state = mongoose.connection.readyState;
    if (state === 0) {
        mongo_status = 'MongoDB is disconnected';
    } else if (state === 1) {
        mongo_status = 'MongoDB is connected';
    } else if (state === 2) {
        mongo_status = 'MongoDB is connecting';
    } else if (state === 3) {
        mongo_status = 'MongoDB is disconnecting';
    } else {
        mongo_status = 'MongoDB connection state is unknown';
    }

    // Respond with JSON containing server and MongoDB status
    res.json({
        message: {
            'Server status': server_status,
            'MongoDB status': mongo_status,
        },
    });
});

export default router;
