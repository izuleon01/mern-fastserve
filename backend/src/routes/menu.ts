import express, { Request, Response } from "express";
import { MenuController } from "../controller/menu";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const result = await new MenuController().getActiveMenu();
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result
        });
    } catch (error: any) {
        res.status(error.status).json({ message: error.message });
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const { startTime, endTime, menuItems } = req.body;
        const result = await new MenuController().addMenu(startTime, endTime, menuItems);
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result
        });
    } catch (error: any) {
        res.status(error.status).json({ message: error.message });
    }
});

router.post("/item", async (req: Request, res: Response) => {
    try {
        const { name, description, price, imageUrl } = req.body;
        const result = await new MenuController().addMenuItem(name, description, price, imageUrl);
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result
        });
    } catch (error: any) {
        res.status(error.status).json({ message: error.message });
    }
});

router.get("/item/:menuItemId", async (req: Request, res: Response) => {
    try {
        const menuItemId = req.params.menuItemId;
        const result = await new MenuController().getMenuItem(menuItemId);
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result
        });
    } catch (error: any) {
        res.status(error.status).json({ message: error.message });
    }
});

router.get("/:menuId", async (req: Request, res: Response) => {
    try {
        const menuId = req.params.menuId;
        const result = await new MenuController().getMenuItems(menuId);
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result
        });
    } catch (error: any) {
        res.status(error.status).json({ message: error.message });
    }
});


export default router;
