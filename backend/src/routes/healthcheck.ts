import express, { Request, Response } from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/healthcheck", async (req: Request, res: Response) => {
    let server_status = "Server is running";
    let mongo_status;
    const state = mongoose.connection.readyState;
    if (state === 0) {
        mongo_status = 'MongoDB is disconnected'
    } else if (state === 1) {
        mongo_status = 'MongoDB is connected'
    } else if (state === 2) {
        mongo_status = 'MongoDB is connecting'
    } else if (state === 3) {
        mongo_status = 'MongoDB is disconnecting'
    } else {
        mongo_status = 'MongoDB connection state is unknown'
    }
    res.json({
        message: {
            "Server status": server_status,
            "MongoDB status": mongo_status
        }
    });
});

export default router;
