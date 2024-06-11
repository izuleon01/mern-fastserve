import express, { Request, Response } from 'express';
import cors from 'cors';
import "dotenv/config";
import healthcheckRoutes from './routes/healthcheck';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use("", healthcheckRoutes)
mongoose.connect(process.env.MONGODB_URI as string);

app.listen(process.env.PORT, () => {
    console.log("server started")
});
