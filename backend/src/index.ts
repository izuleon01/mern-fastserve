import express, { Request, Response } from 'express';
import cors from 'cors';
import "dotenv/config";
import healthcheckRoutes from './routes/healthcheck';
import menuRoutes from './routes/menu';
import orderRoutes from './routes/order';
import mongoose from 'mongoose';

const app = express();
mongoose.connect(process.env.MONGODB_URI as string,{dbName:process.env.MONGODB_DBNAME});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use("", healthcheckRoutes)
app.use("/menu", menuRoutes)
app.use("/order", orderRoutes)

app.listen(process.env.PORT, () => {
    console.log("server started")
});
