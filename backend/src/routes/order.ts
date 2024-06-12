import express, { Request, Response } from "express";
import { MenuController } from "../controller/menu";
import { METHOD_NOT_IMPLEMENTED } from "../shared/error";

const router = express.Router();

router.post("/addtoorder", async (req: Request, res: Response) => {
    try {
        const { menuItemId, quantity } = req.body;
        const result = await new MenuController().addToOrder(menuItemId, quantity);
        const json_result = JSON.parse(JSON.stringify(result))
        res.json({
            message: json_result
        });
    } catch (error: any) {
        if (error.message == METHOD_NOT_IMPLEMENTED) {
            res.status(501).json({ message: METHOD_NOT_IMPLEMENTED });
            return;
        }
        res.status(500).json({
            error: error
        });
    }
});

router.get("/", async (req: Request, res: Response) => {
    try {
        const result = await new MenuController().getOrder();
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result
        });
    } catch (error: any) {
        if (error.message == METHOD_NOT_IMPLEMENTED) {
            res.status(501).json({ message: METHOD_NOT_IMPLEMENTED });
            return;
        }
        res.status(500).json({
            error: error
        });
    }
});

router.get("/:menuItemId", async (req: Request, res: Response) => {
    try {
        const menuItemId = req.params.menuItemId;
        const result = await new MenuController().getOrderItem(menuItemId);
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result
        });
    } catch (error: any) {
        if (error.message == METHOD_NOT_IMPLEMENTED) {
            res.status(501).json({ message: METHOD_NOT_IMPLEMENTED });
            return;
        }
        res.status(500).json({
            error: error
        });
    }
});

router.get("/item", async (req: Request, res: Response) => {
    try {
        const result = await new MenuController().getOrderItems();
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result
        });
    } catch (error: any) {
        if (error.message == METHOD_NOT_IMPLEMENTED) {
            res.status(501).json({ message: METHOD_NOT_IMPLEMENTED });
            return;
        }
        res.status(500).json({
            error: error
        });
    }
});

router.put("/item", async (req: Request, res: Response) => {
    try {
        const { menuItemId, quantity } = req.body;
        const result = await new MenuController().addOrderItem(menuItemId, quantity);
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result
        });
    } catch (error: any) {
        if (error.message == METHOD_NOT_IMPLEMENTED) {
            res.status(501).json({ message: METHOD_NOT_IMPLEMENTED });
            return;
        }
        res.status(500).json({
            error: error
        });
    }
});

router.post("/item", async (req: Request, res: Response) => {
    try {
        const { menuItemId, quantity } = req.body;
        const result = await new MenuController().updateOrderItem(menuItemId, quantity);
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result
        });
    } catch (error: any) {
        if (error.message == METHOD_NOT_IMPLEMENTED) {
            res.status(501).json({ message: METHOD_NOT_IMPLEMENTED });
            return;
        }
        res.status(500).json({
            error: error
        });
    }
});

router.delete("/item", async (req: Request, res: Response) => {
    try {
        const { menuItemId } = req.body;
        const result = await new MenuController().removeOrderItem(menuItemId);
        const json_result = JSON.parse(JSON.stringify(result));
        res.json({
            message: json_result
        });
    } catch (error: any) {
        if (error.message == METHOD_NOT_IMPLEMENTED) {
            res.status(501).json({ message: METHOD_NOT_IMPLEMENTED });
            return;
        }
        res.status(500).json({
            error: error
        });
    }
});

export default router;
