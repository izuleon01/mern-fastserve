import express, { Request, Response } from 'express';
import cors from 'cors';
import "dotenv/config";
import healthcheckRoutes from './routes/healthcheck'
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use("", healthcheckRoutes)

app.listen(process.env.PORT, () => {
    console.log("server started")
});
