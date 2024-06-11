import express, { Request, Response } from "express";

const router = express.Router();

router.get("/healthcheck", async (req: Request, res: Response) => {
    res.json({ message: "Server is running" });
});

export default router;
